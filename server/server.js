require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


// 允许跨域请求 (根据需要配置前端域名)
app.use(cors());
app.use(express.json());

// --- 1. Gemini 文本生成接口 ---
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "Server missing Gemini API Key" });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API Error");
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ text });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- 2. Coze 生图接口 ---
app.post('/api/coze/run', async (req, res) => {
  try {
    const { prompt } = req.body;
    const token = process.env.COZE_API_TOKEN;
    const workflowId = process.env.COZE_WORKFLOW_ID;

    if (!token || !workflowId) return res.status(500).json({ error: "Server missing Coze configs" });

    const response = await fetch('https://api.coze.cn/v1/workflow/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        parameters: {
          prompt: prompt,
          img: "{}",
          BOT_USER_INPUT: "",
          propotion: "16:9"
        }
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("Coze Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- 3. Hugging Face 生图接口 ---
app.post('/api/hf/generate', async (req, res) => {
  try {
    const { inputs } = req.body;
    const token = process.env.HF_API_TOKEN;

    if (!token) return res.status(500).json({ error: "Server missing HF Token" });

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true" 
        },
        method: "POST",
        body: JSON.stringify({ inputs }),
      }
    );

    if (!response.ok) {
      throw new Error(`HF Error: ${response.statusText}`);
    }

    // 将二进制图片流转换为 Base64 返回给前端
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    res.json({ imageUrl: dataUrl });

  } catch (error) {
    console.error("HF Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- 4. Notion 保存接口 ---
app.post('/api/notion/save', async (req, res) => {
  try {
    const { title, content, keywords, coverUrl } = req.body;
    const secret = process.env.NOTION_SECRET;
    const dbId = process.env.NOTION_DB_ID;

    if (!secret || !dbId) return res.status(500).json({ error: "Server missing Notion configs" });

    // 简单的文本分块逻辑 (Notion Block 限制 2000 字符)
    const cleanText = content.replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n\n').trim();
    const contentChunks = cleanText.match(/.{1,2000}/g) || [cleanText];
    
    const childrenBlocks = contentChunks.map(chunk => ({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: chunk } }]
      }
    }));

    const payload = {
      parent: { database_id: dbId },
      properties: {
        Name: { title: [{ text: { content: title } }] },
        Tags: { multi_select: keywords.map(k => ({ name: k })) }
      },
      children: childrenBlocks
    };

    if (coverUrl) {
      payload.cover = {
        type: "external",
        external: { url: coverUrl }
      };
    }

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Notion API Error");
    }

    res.json({ success: true, url: data.url });

  } catch (error) {
    console.error("Notion Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
