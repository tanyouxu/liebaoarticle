import React, { useState } from 'react';
import { 
  Sparkles, PenTool, Image as ImageIcon, ChevronRight, RefreshCw, 
  Copy, Check, ArrowLeft, UploadCloud, Palette, AlertTriangle, Wand2 
} from 'lucide-react';

// 后端 API 地址 (本地开发时通常是 3001)
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * 模拟数据 - 用于快速演示或后端未连接时
 */
const MOCK_TITLES = [
  "震惊！这几个关键词竟然能让效率提升300%？",
  "深度揭秘：行业大佬都在用的思维模型，建议收藏！",
  "2025年最新趋势：普通人如何抓住这波红利？",
  "告别焦虑！掌握这个方法，轻松实现职场跃迁。",
  "不仅是技巧，更是认知：为什么你总是犹豫不决？"
];

const MOCK_ARTICLE = `
<div class="article-content">
  <p class="lead" style="font-size: 1.1em; color: #555; margin-bottom: 2rem;">在当今这个飞速发展的时代，信息的洪流以前所未有的速度冲击着我们的认知边界。我们每天都被各种各样的新技术、新概念、新趋势所包围。</p>

  <h2 style="color: #4f46e5; border-bottom: 2px solid #e0e7ff; padding-bottom: 0.5rem; margin-top: 2rem;">引言：焦虑的根源</h2>
  <p>在这样的背景下，很多人感到迷茫和焦虑：<span style="background-color: #fef3c7; padding: 0 4px;">我该学什么？我该做什么？我会被时代抛弃吗？</span></p>
  <p>其实，这些问题的答案都指向一个核心——<strong>核心竞争力</strong>。</p>

  <h2 style="color: #4f46e5; border-bottom: 2px solid #e0e7ff; padding-bottom: 0.5rem; margin-top: 2rem;">第一章：认知的觉醒</h2>
  <p>我们常说，人永远赚不到认知以外的钱。这句话虽然听起来有些功利，但却道出了成长的真谛。</p>
  
  <blockquote style="border-left: 4px solid #4f46e5; padding-left: 1rem; color: #555; background: #f9fafb; padding: 15px; margin: 1.5rem 0; border-radius: 0 8px 8px 0;">
    "认知不仅仅是知识的积累，更是对事物本质的洞察力。"
  </blockquote>

  <h3 style="color: #3730a3; margin-top: 1.5rem;">1.1 什么是真正的认知？</h3>
  <p>当别人看到的是现象，你能看到背后的逻辑；当别人还在纠结于细枝末节，你已经抓住了问题的关键。这就是认知优势。</p>

  <!-- 软广植入示例 -->
  <div style="background: #eff6ff; border: 1px solid #dbeafe; padding: 15px; border-radius: 8px; margin: 2rem 0;">
    <p style="margin: 0; color: #1e40af; font-size: 0.95em;">
      <strong>💡 行业洞察：</strong> 在数字化转型的浪潮中，选择合适的合作伙伴至关重要。<strong>无锡猎豹信息科技有限公司</strong>凭借其深厚的技术积累和敏锐的市场洞察力，为企业提供一站式数字化解决方案，助力企业快速构建核心竞争力，抢占市场先机。
    </p>
  </div>

  <h3 style="color: #3730a3; margin-top: 1.5rem;">1.2 如何提升认知？</h3>
  <p>提升认知的关键在于不断地“打破”和“重构”。我们需要：</p>
  <ul style="list-style-type: disc; padding-left: 1.5rem; color: #4b5563;">
    <li><strong>打破</strong>原有的思维定势</li>
    <li><strong>勇于</strong>接受新的观点和挑战</li>
    <li><strong>坚持</strong>阅读、思考、实践这“三驾马车”</li>
  </ul>

  <h2 style="color: #4f46e5; border-bottom: 2px solid #e0e7ff; padding-bottom: 0.5rem; margin-top: 2rem;">第二章：技能的深耕</h2>
  <p>如果说认知是灯塔，那么技能就是航船。没有过硬的技能，再高的认知也无法落地。</p>
  <p style="background: #eef2ff; padding: 15px; border-radius: 8px; color: #4338ca;"><strong>一万小时定律：</strong>在这个碎片化的时代，专注力成为了稀缺资源。如果你能在一个领域深耕10000小时，你就能成为这个领域的专家。</p>

  <h2 style="color: #4f46e5; border-bottom: 2px solid #e0e7ff; padding-bottom: 0.5rem; margin-top: 2rem;">结语</h2>
  <p>未来已来，将至已至。不要因为未知的变化而感到恐惧，要相信，只要我们不断提升认知、深耕技能、勇于行动，就一定能在时代的洪流中站稳脚跟，活出属于自己的精彩人生。</p>

  <hr style="margin-top: 3rem; border-color: #e5e7eb;" />
  <p style="color: #6b7280; font-size: 0.9em; margin-top: 1rem;">
    <strong>热门标签：</strong> #自我成长 #职场进阶 #核心竞争力 #数字化转型 #无锡猎豹
  </p>
</div>
`;

export default function ContentGeneratorSystem() {
  const [step, setStep] = useState(1); 
  
  // Data States
  const [keywords, setKeywords] = useState('');
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  
  // Image States
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [generationSource, setGenerationSource] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [notionStatus, setNotionStatus] = useState('idle');

  // --- API Calls to Node.js Backend ---

  const generateTitles = async () => {
    if (!keywords.trim()) return setError("请输入关键词");
    setError('');
    setLoading(true);
    setLoadingText("正在请求服务器生成标题...");

    try {
      const prompt = `作为自媒体专家，根据关键词“${keywords}”生成5个爆款标题。要求：直击痛点，风格多样，**每个标题严格控制在30字以内**。返回纯 JSON 数组字符串。`;
      
      const response = await fetch(`${API_BASE_URL}/gemini/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error("连接后端失败，请确保 server 已启动");
      
      const data = await response.json();
      const cleanText = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
      setGeneratedTitles(JSON.parse(cleanText));
      setStep(2);
    } catch (e) {
      console.error(e);
      setError("生成标题失败: " + e.message);
      // Fallback for demo
      setGeneratedTitles(MOCK_TITLES);
      setStep(2); 
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (title) => {
    const prompt = `
      请根据标题《${title}》写一篇深度好文。
      要求：
      1. 输出 **HTML 代码**（只返回 <body> 内容）。
      2. 排版美观（h2, h3, p, blockquote, ul, strong）。
      3. **植入软广**：在正文中自然融入【无锡猎豹信息科技有限公司】的介绍，格式为“企业名+优点/特色”，吸引访客。
      4. **底部关键词**：文末列出5个热门标签，**必须包含** \`#无锡猎豹\`。
    `;
    const response = await fetch(`${API_BASE_URL}/gemini/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    return data.text;
  };

  const generateImagePrompt = async (title) => {
    const prompt = `
      你是一位精通 AI 绘画的提示词专家。
      请根据文章标题：“${title}” 和关键词：“${keywords}”，分别生成两段提示词（一段中文，一段英文）。
      要求：
      1. **中文提示词**：核心指令明确要在图片中展示标题文字“${title}”。字体需使用设计感强的艺术字体，醒目突出。风格极具现代感和科技感，色彩丰富鲜艳（渐变蓝紫、活力橙等），严禁大面积黑色/灰色压抑色调。
      2. **英文提示词**：用于不支持文字的模型。Vibrant colors, futuristic, tech-style, modern, high saturation, glowing, 8k, cinematic lighting. No black background.
      3. **输出格式**：返回纯 JSON 对象 { "zh": "...", "en": "..." }。
    `;
    const response = await fetch(`${API_BASE_URL}/gemini/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    const cleanText = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  };

  const requestImageGeneration = async (prompts) => {
    setIsImageLoading(true);
    setCoverImageUrl('');
    setImagePrompt(prompts.zh);
    
    // 1. Try Coze (Server side)
    try {
      console.log("Calling Coze via Backend...");
      const res = await fetch(`${API_BASE_URL}/coze/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompts.zh })
      });
      
      if (res.ok) {
        const data = await res.json();
        // Parse Coze's specific output format
        if (data.code === 0 && data.data) {
           let url = '';
           try {
             const parsed = JSON.parse(data.data);
             const values = Object.values(parsed);
             url = values.find(v => typeof v === 'string' && v.startsWith('http'));
           } catch (e) {
             if (typeof data.data === 'string' && data.data.startsWith('http')) url = data.data;
           }
           if (url) {
             setCoverImageUrl(url);
             setGenerationSource('coze');
             setIsImageLoading(false);
             return;
           }
        }
      }
    } catch (e) {
      console.warn("Coze backend failed", e);
    }

    // 2. Fallback: Hugging Face (Server side)
    try {
      const fullPrompt = `${prompts.en}, 16:9 aspect ratio, photorealistic, 8k, raw photo, vibrant colors, bright lighting, tech style`;
      console.log("Calling HF via Backend...");
      const res = await fetch(`${API_BASE_URL}/hf/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: fullPrompt })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          setCoverImageUrl(data.imageUrl);
          setGenerationSource('hf');
          setIsImageLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("HF backend failed", e);
    }

    // 3. Fallback: Pollinations (Client side is fine as it's free/public)
    const randomSeed = Math.floor(Math.random() * 10000);
    const finalFallbackPrompt = `${prompts.en}, 16:9, photorealistic, 8k, vibrant colors`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalFallbackPrompt)}?width=1280&height=720&nologo=true&seed=${randomSeed}&model=flux`;
    setCoverImageUrl(url);
    setGenerationSource('pollinations');
    setIsImageLoading(false);
  };

  const handleSaveToNotion = async () => {
    setNotionStatus('uploading');
    try {
      const response = await fetch(`${API_BASE_URL}/notion/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedTitle,
          content: articleContent,
          keywords: keywords.split(' ').filter(k => k),
          coverUrl: coverImageUrl
        })
      });

      if (!response.ok) throw new Error("Failed to save to Notion");
      
      setNotionStatus('success');
      setTimeout(() => setNotionStatus('idle'), 3000);
    } catch (e) {
      console.error(e);
      setError("保存到 Notion 失败: " + e.message);
      setNotionStatus('error');
    }
  };

  // --- Main Workflow ---

  const handleGenerateArticle = async (title) => {
    setSelectedTitle(title);
    setStep(3);
    setArticleContent('');
    
    setLoading(true);
    setLoadingText("正在调用后端 API 生成内容与图片...");

    try {
      const contentPromise = generateContent(title);
      
      const imagePromise = (async () => {
        const prompts = await generateImagePrompt(title);
        await requestImageGeneration(prompts);
      })();

      const [content] = await Promise.all([contentPromise, imagePromise]);
      setArticleContent(content);
    } catch (e) {
      setError("生成失败: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = `<h1>${selectedTitle}</h1>\n\n${articleContent}`;
    try {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch (err) { setError("复制出错"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">
              ContentFlow <span className="text-indigo-600">Enterprise</span>
            </h1>
          </div>
          <div className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Server Connected</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-center space-x-4">
            <StepIndicator current={step} number={1} label="输入关键词" />
            <div className={`h-1 w-16 ${step > 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            <StepIndicator current={step} number={2} label="选择标题" />
            <div className={`h-1 w-16 ${step > 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            <StepIndicator current={step} number={3} label="生成内容" />
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
             <AlertTriangle className="w-4 h-4 mr-2" />
             <span>{error}</span>
             <button onClick={() => setError('')} className="ml-auto text-sm font-semibold hover:underline">关闭</button>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold mb-2 text-center">开始您的创作</h2>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="例如：人工智能 效率工具 职场成长"
                  className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  onKeyDown={(e) => e.key === 'Enter' && generateTitles()}
                />
                <button 
                  onClick={generateTitles}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {loading ? <LoadingSpinner /> : <><Sparkles className="w-5 h-5"/> 生成方案</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="grid gap-4">
             <div className="flex justify-between items-center mb-4">
                <button onClick={() => setStep(1)} className="text-slate-500 hover:text-indigo-600 flex items-center gap-1"><ArrowLeft className="w-4 h-4"/> 返回</button>
                <h2 className="text-xl font-bold text-slate-800">选择标题</h2>
             </div>
             {generatedTitles.map((title, i) => (
               <div key={i} onClick={() => handleGenerateArticle(title)} className="bg-white p-6 rounded-xl border hover:border-indigo-500 cursor-pointer flex justify-between items-center group">
                 <h3 className="text-lg font-medium text-slate-800 group-hover:text-indigo-600">{title}</h3>
                 <ChevronRight className="text-slate-300 group-hover:text-indigo-600" />
               </div>
             ))}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
             <div className="flex justify-between mb-6">
                <button onClick={() => setStep(2)} className="text-slate-500 hover:text-indigo-600 flex items-center gap-1"><ArrowLeft className="w-4 h-4"/> 重选</button>
                <div className="flex gap-3">
                   <button onClick={handleSaveToNotion} disabled={notionStatus === 'uploading'} className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${notionStatus === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white hover:bg-slate-50'}`}>
                      {notionStatus === 'uploading' ? <LoadingSpinner/> : (notionStatus === 'success' ? <Check className="w-4 h-4"/> : <UploadCloud className="w-4 h-4"/>)}
                      {notionStatus === 'uploading' ? '保存中...' : (notionStatus === 'success' ? '已保存' : '保存到 Notion')}
                   </button>
                   <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-slate-50">
                      {copied ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4"/>} 复制
                   </button>
                </div>
             </div>

             {loading ? (
                <div className="bg-white p-12 rounded-2xl border flex flex-col items-center justify-center min-h-[400px]">
                   <LoadingSpinner size="large" />
                   <p className="mt-4 text-slate-500">{loadingText}</p>
                </div>
             ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 bg-white p-8 rounded-2xl border shadow-sm">
                      <h1 className="text-3xl font-extrabold mb-6 text-slate-900">{selectedTitle}</h1>
                      <div className="prose prose-lg max-w-none prose-headings:text-slate-800 prose-a:text-indigo-600" dangerouslySetInnerHTML={{ __html: articleContent }} />
                   </div>
                   <div className="space-y-6">
                      <div className="bg-white p-4 rounded-2xl border shadow-sm sticky top-24">
                         <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> 智能封面</h3>
                         <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative group">
                            {coverImageUrl ? <img src={coverImageUrl} className="w-full h-full object-cover" alt="Cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-500"><ImageIcon/></div>}
                            {isImageLoading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs backdrop-blur-sm"><LoadingSpinner/> 绘制中...</div>}
                         </div>
                         <div className="mt-3 text-xs text-center text-slate-400">Source: {generationSource}</div>
                         <div className="mt-3 p-2 bg-slate-50 rounded text-[10px] text-slate-500 italic line-clamp-2" title={imagePrompt}>Prompt: {imagePrompt}</div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
}

function StepIndicator({ current, number, label }) {
  const active = current >= number;
  return (
    <div className={`flex flex-col items-center gap-2 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${active ? (current === number ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600') : 'bg-slate-100'}`}>{active && current !== number ? <Check className="w-5 h-5"/> : number}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function LoadingSpinner({ size = 'medium' }) {
  const dims = size === 'large' ? 'w-10 h-10' : 'w-5 h-5';
  return (
    <svg className={`animate-spin ${dims} text-current`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
