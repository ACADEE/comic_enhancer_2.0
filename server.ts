import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Type declarations
interface ImageTask {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  resultUrl?: string;
  error?: string;
  type?: 'generate' | 'upscale';
}

const tasks = new Map<string, ImageTask>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '100mb' }));

  // API Routes
  
  // 1. Upload & Create Task
  app.post('/api/process-image', async (req, res) => {
    try {
      const { base64Data, fileName, appUrl: clientAppUrl, prompt, customApiKey, aspectRatio } = req.body;
      const apiKey = customApiKey || req.headers['x-api-key'] || process.env.KIE_API_KEY;

      if (!apiKey) {
        return res.status(401).json({ error: 'KIE_API_KEY non configurée.' });
      }
      
      // A. Upload the file to Kie.ai
      const uploadRes = await fetch('https://kieai.redpandaai.co/api/file-base64-upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          base64Data,
          uploadPath: 'bd-enhancer',
          fileName: fileName || `page-${Date.now()}.jpg`
        })
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Upload failed: ${errText}`);
      }

      const uploadResult = await uploadRes.json() as any;
      const fileUrl = uploadResult?.data?.downloadUrl || uploadResult?.data?.fileUrl;

      if (!fileUrl) {
        throw new Error('Upload succeeded but no downloadUrl returned');
      }

      // B. Create the image-to-image task
      const appUrl = clientAppUrl || process.env.APP_URL || `http://localhost:${PORT}`;
      const callbackUrl = `${appUrl}/api/kie-callback`;

      const taskRes = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-image-2-image-to-image',
          callBackUrl: callbackUrl,
          input: {
            prompt: prompt || 'agis comme le maitre mondiale des bande dessinée. améliore la lisibilité des textes.',
            input_urls: [fileUrl],
            aspect_ratio: aspectRatio || 'auto',
            resolution: '2K'
          }
        })
      });

      if (!taskRes.ok) {
        const errText = await taskRes.text();
        throw new Error(`Task creation failed: ${errText}`);
      }

      const taskResult = await taskRes.json() as any;
      if (taskResult.code === 401) {
        return res.status(401).json({ error: 'KIE_API_KEY invalide.' });
      }
      const taskId = taskResult?.data?.taskId;

      if (!taskId) {
        throw new Error('Task creation succeeded but no taskId returned');
      }

      // Save task to memory
      tasks.set(taskId, {
        id: taskId,
        status: 'processing',
        type: 'generate'
      });

      res.json({ success: true, taskId, fileUrl, msg: taskResult.msg || 'Task created successfully' });
    } catch (error: any) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: error.message || 'Unknown error' });
    }
  });

  // 1a. Upscale Task
  app.post('/api/upscale-image', async (req, res) => {
    try {
      const { resultUrl, base64, appUrl: clientAppUrl, customApiKey, fileName } = req.body;
      const apiKey = customApiKey || req.headers['x-api-key'] || process.env.KIE_API_KEY;

      if (!apiKey) {
        return res.status(401).json({ error: 'KIE_API_KEY non configurée.' });
      }

      let imageUrlToUpscale = resultUrl;

      // If no resultUrl is provided, we might have base64 from a raw image
      if (!imageUrlToUpscale && base64) {
        
        const uploadRes = await fetch('https://kieai.redpandaai.co/api/file-base64-upload', {
           method: 'POST',
           headers: {
             'Authorization': `Bearer ${apiKey}`,
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({ 
             base64Data: base64,
             uploadPath: 'bd-enhancer',
             fileName: fileName || `upscale-${Date.now()}.jpg`
           })
        });
        
        if (!uploadRes.ok) {
           const errText = await uploadRes.text();
           throw new Error(`Upload before upscale failed: ${errText}`);
        }
        
        const uploadData = await uploadRes.json() as any;
        if (uploadData.code === 401) {
           return res.status(401).json({ error: 'KIE_API_KEY invalide.' });
        }
        
        imageUrlToUpscale = uploadData?.data?.downloadUrl || uploadData?.data?.fileUrl;
      }

      if (!imageUrlToUpscale) {
         return res.status(400).json({ error: 'resultUrl ou base64 est requis.' });
      }

      const appUrl = clientAppUrl || process.env.APP_URL || `http://localhost:${PORT}`;
      const callbackUrl = `${appUrl}/api/kie-callback`;

      const { upscaleModel } = req.body;
      const targetModel = upscaleModel || 'recraft/crisp-upscale';
      
      const inputPayload = targetModel === 'topaz/image-upscale' 
        ? { image_url: imageUrlToUpscale, upscale_factor: "2" }
        : { image: imageUrlToUpscale };

      const taskRes = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: targetModel,
          callBackUrl: callbackUrl,
          input: inputPayload
        })
      });

      if (!taskRes.ok) {
        const errText = await taskRes.text();
        throw new Error(`Upscale task creation failed: ${errText}`);
      }

      const taskResult = await taskRes.json() as any;
      if (taskResult.code === 401) {
        return res.status(401).json({ error: 'KIE_API_KEY invalide.' });
      }
      const taskId = taskResult?.data?.taskId;

      if (!taskId) {
        throw new Error('Upscale task creation succeeded but no taskId returned');
      }

      tasks.set(taskId, {
        id: taskId,
        status: 'processing',
        type: 'upscale'
      });

      res.json({ success: true, taskId, msg: taskResult.msg || 'Upscale task created successfully' });
    } catch (error: any) {
      console.error('Error upscaling image:', error);
      res.status(500).json({ error: error.message || 'Unknown error' });
    }
  });

  // 1b. Check Credits
  app.get('/api/credits', async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'] || process.env.KIE_API_KEY;
      if (!apiKey) {
        return res.status(401).json({ error: 'KIE_API_KEY non configurée.' });
      }

      const creditRes = await fetch('https://api.kie.ai/api/v1/chat/credit', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!creditRes.ok) {
        const errText = await creditRes.text();
        throw new Error(`Credit fetch failed: ${errText}`);
      }

      const data = await creditRes.json();
      if (data.code === 401) {
        return res.status(401).json({ error: 'KIE_API_KEY invalide.' });
      }
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching credits:', error);
      res.status(500).json({ error: error.message || 'Unknown error' });
    }
  });

  // 2. Webhook Callback from Kie.ai
  app.post('/api/kie-callback', (req, res) => {
    try {
      const data = req.body;
      console.log('Received callback from Kie.ai:', JSON.stringify(data, null, 2));
      
      // Expected payload typically has taskId and status/result
      const taskId = data.taskId || data.id; 
      if (taskId && tasks.has(taskId)) {
        const task = tasks.get(taskId)!;
        
        // This relies on the structure of the kie.ai callback, we assume result is under data or result
        const rawStatus = data.status || (data.data && data.data.status) || data.state;
        const status = String(rawStatus).toLowerCase();
        
        if (status === 'success' || status === 'completed' || status === 'succeeded' || rawStatus === 1 || data.code === 200) {
           task.status = 'completed';
           
           const dataBlock = data.data || data;
           let resultUrl = dataBlock.result?.url || dataBlock.result?.images?.[0] || dataBlock.images?.[0]?.url || dataBlock.images?.[0] || dataBlock.imageUrl || dataBlock.url || dataBlock.image_url;
           
           if (!resultUrl) {
              if (typeof dataBlock.result === 'string') resultUrl = dataBlock.result;
              else if (Array.isArray(dataBlock.result) && dataBlock.result.length > 0) resultUrl = dataBlock.result[0];
              else if (Array.isArray(dataBlock.data) && dataBlock.data.length > 0) resultUrl = dataBlock.data[0];
           }
           
           task.resultUrl = resultUrl;
        } else if (status === 'failed' || status === 'fail' || status === 'error' || rawStatus === -1 || data.code !== 200) {
           task.status = 'error';
           task.error = data.msg || data.error || 'Generation failed';
        } else {
           // If we just get the URL directly
           if (data.images && data.images.length > 0) {
             task.status = 'completed';
             task.resultUrl = typeof data.images[0] === 'string' ? data.images[0] : data.images[0].url;
           }
        }
        tasks.set(taskId, task);
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error('Callback parsing error:', error);
      res.status(500).send('Error');
    }
  });

  // 3. Poll Task Status
  app.get('/api/tasks/:taskId', async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const task = tasks.get(taskId);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      // If the task is still processing in our memory, check with Kie.ai API
      if (task.status === 'processing') {
        const apiKey = req.headers['x-api-key'] || process.env.KIE_API_KEY;
        if (apiKey) {
          const pollRes = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (pollRes.ok) {
            const pollData = await pollRes.json() as any;
            if (pollData.code === 401) {
              return res.status(401).json({ error: 'KIE_API_KEY invalide.' });
            }
            if (pollData && (pollData.code === 200 || pollData.data)) {
               const data = pollData.data || {};
               const rawStatus = data.state || pollData.status || data.status;
               const status = String(rawStatus).toLowerCase();
               
               if (status === 'success' || status === 'completed' || status === 'succeeded' || rawStatus === 1) {
                 task.status = 'completed';
                 let resultUrl = null;

                 if (data.resultJson) {
                   try {
                     const parsed = JSON.parse(data.resultJson);
                     resultUrl = parsed.resultUrls?.[0] || parsed.firstFrameUrl?.[0] || parsed.lastFrameUrl?.[0] || parsed.result?.url || parsed.image_url || parsed.imageUrl || parsed.url; if (!resultUrl && typeof parsed === "string") resultUrl = parsed; if (!resultUrl && typeof parsed.result === "string") resultUrl = parsed.result;
                   } catch (e) {
                     console.error('Error parsing resultJson:', e);
                   }
                 }
                 
                 // Fallback to legacy checks
                 if (!resultUrl) {
                    if (typeof data.result === 'string') resultUrl = data.result;
                    else resultUrl = data.result?.url || data.result?.images?.[0] || data.images?.[0]?.url || data.images?.[0] || data.imageUrl || data.url;
                 }
                 if (!resultUrl) {
                    if (Array.isArray(data.result) && data.result.length > 0) resultUrl = data.result[0];
                    else if (Array.isArray(data) && data.length > 0) resultUrl = data[0];
                 }
                 
                 task.resultUrl = resultUrl;
                 tasks.set(taskId, task);
               } else if (status === 'fail' || status === 'failed' || status === 'error' || rawStatus === -1) {
                 task.status = 'error';
                 task.error = data.failMsg || data.msg || data.error || 'Generation failed on Kie.ai';
                 tasks.set(taskId, task);
               }
            }
          }
        }
      }
      
      res.json(task);
    } catch (error: any) {
      console.error('Error polling task:', error);
      res.status(500).json({ error: error.message || 'Unknown error during polling' });
    }
  });

  // 4. Proxy Image Download
  app.get('/api/proxy-image', async (req, res) => {
    try {
      const imageUrl = req.query.url as string;
      if (!imageUrl) {
        return res.status(400).json({ error: 'Missing url parameter' });
      }
      
      const imageRes = await fetch(imageUrl);
      if (!imageRes.ok) {
         throw new Error(`Failed to fetch image: ${imageRes.statusText}`);
      }

      const contentType = imageRes.headers.get('content-type');
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }
      
      const arrayBuffer = await imageRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
    } catch (error: any) {
      console.error('Error proxying image:', error);
      res.status(500).json({ error: error.message || 'Unknown error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
