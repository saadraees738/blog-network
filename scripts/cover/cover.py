import sys, json
from PIL import Image, ImageDraw, ImageFont, ImageStat
F='/usr/share/fonts/opentype/inter/Inter-%s.otf'
import os
def f(w,s):
    for path in (F%w,'/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'):
        if os.path.exists(path): return ImageFont.truetype(path,s)
    return ImageFont.load_default()
W,H=1200,630
ACC={'CRM':(76,201,240),'Automation':(255,138,61),'AI Coding':(167,139,250),'AI Video':(244,114,182),'AI Images':(250,204,21),
     'AI Writing':(52,211,153),'AI Assistants':(251,146,120),'AI Productivity':(45,212,191),'AI Meetings':(129,140,248),
     'AI Explainers':(96,165,250),'AI Hardware':(251,191,36),'Robots':(248,113,113),'AI Safety':(74,222,128),'AI Presentations':(232,121,249),'Gaming':(45,212,191),'AI Models':(129,140,248),'AI Agents':(52,211,153),'AI Privacy':(94,234,212),'AI Developer Tools':(45,212,191),'AI Infrastructure':(56,189,248),'AI Shopping':(250,204,21),'AI Music':(244,114,182),'AI Phones':(96,165,250),'AI Social Media':(129,140,248),'AI Search':(96,165,250)}
POSTS={
 'google-ai-mode-wallet-drive-connect-explained':('AI Search','AI Mode meets Wallet and Drive'),
 'xpeng-iron-humanoid-robot-timeline-explained':('Robots','XPENG IRON robot: the planned dates'),
 'facebook-your-algorithm-controls-explained':('AI Social Media','Facebook Your Algorithm, explained'),
 'android-gemini-intelligence-november-pixel-drop-explained':('AI Phones','Gemini Intelligence on Android'),
 'tidal-ai-music-ban-december-9-explained':('AI Music','Tidal AI music ban, explained'),
 'ncsc-agentic-cyber-attacks-eight-checks-explained':('AI Safety','AI agent attacks: eight checks'),
 'black-friday-2026-google-price-tracking-how-to':('AI Shopping','Check Black Friday deals on Google'),
 'wall-oss-1-0-robot-model-explained':('Robots','WALL-OSS-1.0, explained'),
 'gemini-notebook-interactive-sites-explained':('AI Productivity','Gemini Notebook sites, explained'),
 'openai-images-2-6-gifs-explained':('AI Images','OpenAI Images 2.6, explained'),
    'deepmind-quantum-agents-lean-verified-explained':('AI Research','AI agents and quantum algorithms'),
    'canva-mcp-ai-assistants-explained-what-canva-says':('AI Developer Tools','Canva inside AI assistants'),
 'shirudo-openai-cisco-ebpf-shields-explained':('AI Safety','Shirudo shields, explained'),
 'claude-ship-pr-review-steward-approvals-explained':('AI Coding','Claude Ship, explained'),
 'openai-chatgpt-wallet-agent-payments-explained':('AI Agents','ChatGPT Wallet, explained'),
 'seedance-2-5-explained-what-bytedance-says':('AI Video','Seedance 2.5, explained'),
    'google-tpu-8tx-8i-max-explained-what-google-says':('AI Hardware','Google TPU 8tx and 8i Max'),
 'openai-codex-sandbox-explained-how-it-limits-commands':('AI Coding','Codex sandbox, explained'),
 'openai-perplexity-intelligence-metric-explained':('AI Safety','OpenAI perplexity metric, explained'),
 'gemini-api-tool-retrieval-explained-what-google-says':('AI Developer Tools','Gemini Tool Retrieval, explained'),
 'signal-screen-security-microsoft-recall-explained':('AI Privacy','Signal Screen Security, explained'),
 'cloudflare-clef-decision-models-explained':('AI Models','Cloudflare Clef explained'),
'claude-personal-finance-beta-explained':('AI Assistants','Claude Personal Finance, explained'),
'nvidia-vera-cpu-agents-explained':('AI Hardware','Nvidia Vera CPU, explained'),
'google-agent-compute-engine-substrate-sandbox-explained':('AI Infrastructure','Google agent sandboxes, explained'),
'meta-muse-personal-agent-voice-explained':('AI Assistants','Meta Muse, explained'),
'copilotforce-salesforce-microsoft-explained':('AI Productivity','Copilotforce, explained'),
'adobe-firefly-max-2026-agents-explained':('AI Images','Adobe Firefly at MAX, explained'),
'openai-dots-always-on-agent-explained':('AI Agents','OpenAI dots, explained'),
'claude-fable-5-2-explained-what-anthropic-says':('AI Assistants','Claude Fable 5.2, explained'),
'gpt-6-cyber-daybreak-access-explained':('AI Safety','GPT-6 Cyber, explained'),
'claude-meetings-beta-explained-what-team-enterprise-get':('AI Meetings','Claude Meetings, explained'),
'gemini-4-neon-explained-what-google-says':('AI Models','Gemini 4 Neon, explained'),
'gemini-computer-use-mac-explained-what-google-says':('AI Assistants','Gemini on Mac, explained'),
'gemini-task-mode-explained-what-google-says':('AI Assistants','Gemini Task mode, explained'),
'lg-nvidia-robot-data-factory-explained-what-is-confirmed':('Robots','LG robot Data Factory, explained'),
'agibot-worken-robot-work-metric-explained':('Robots','AGIBOT Worken, explained'),
'cloudflare-clairic-extraction-model-explained':('AI Models','Cloudflare Clairic, explained'),
'vs-code-1-147-send-later-browser-use-explained':('AI Coding','VS Code 1.147, explained'),
'ring-drone-cam-rover-cam-security-robots-what-is-reported':('Robots','Ring patrol robots, explained'),
'openai-jalapeno-inference-chip-explained-what-is-claimed':('AI Hardware','OpenAI Jalapeno chip, explained'),
'canva-ai-off-switch-what-it-turns-off':('AI Productivity','Canva AI off switch, explained'),
'paris-ai-safety-declaration-explained-what-it-commits-to':('AI Safety','Paris AI Safety Call, explained'),
'mai-code-2-copilot-explained-what-microsoft-claims':('AI Coding','Microsoft MAI Code 2, explained'),
'gemini-decisions-api-explained-what-it-does':('AI Developer Tools','Gemini Decisions API, explained'),
'businesses-in-chatgpt-small-business-explained':('AI Assistants','Businesses in ChatGPT, explained'),
'ai-chat-training-opt-out-claude-gemini-how-to':('AI Privacy','Stop AI training on your chats'),
'lazarus-backdoor-ai-agents-explained':('AI Safety','Lazarus backdoor, explained'),
'claude-sheets-whiteboards-data-what-is-beta':('AI Productivity','Claude Sheets and Whiteboards'),
'microsoft-ai-transparency-initiative-explained':('AI Safety','Microsoft AI Transparency, explained'),
    'antigravity-teamwork-multi-agent-explained':('AI Coding','Antigravity Teamwork, explained'),
'gta-6-launch-week-what-is-confirmed':('Gaming','GTA 6 launch week: what is confirmed'),
'google-vids-free-ai-video-limits-and-how-to-start':('AI Video','Google Vids free AI video'),
'apple-homeview-explained-who-its-for':('AI Hardware','Apple HomeView, explained'),
'ai-shopping-agents-what-is-live-and-how-to-stay-safe':('AI Agents','AI shopping agents: what is live?'),
'gemini-4-hydrogen-explained-which-model-to-use':('AI Models','Gemini 4 Hydrogen, explained'),
'home-robots-2026-on-sale-vs-demo':('Robots','Home robots: on sale or just demos?'),
'ai-presentation-makers-pricing-compared':('AI Presentations','AI slide makers: what each charges'),
'samsung-intelligent-eyewear-ai-glasses-explained':('AI Hardware',"Samsung's first AI glasses"),
'ai-tool-customer-data-checklist':('AI Safety','Before AI sees customer data'),
'what-are-ai-agents-plain-english':('AI Explainers','AI agents in plain English'),
'ai-assistant-client-proposal-in-20-minutes':('AI Assistants','Write a client proposal in 20 minutes'),
'free-crm-for-small-business-compared':('CRM','Free CRM for small business, compared'),
'hubspot-free-crm-limits':('CRM','HubSpot free CRM: what you get and where the limits are'),
'zoho-crm-free-edition':('CRM','Zoho CRM free edition: what 3 users get'),
'zoho-crm-vs-hubspot-paid-plans':('CRM','Zoho CRM vs HubSpot: what paid plans cost'),
'zapier-vs-make-pricing':('Automation','Zapier vs Make: what the same workflow costs'),
'zapier-alternatives-pricing':('Automation','Zapier alternatives and what each one charges'),
'free-automation-plans-compared':('Automation','Free automation plans compared'),
'n8n-vs-zapier-vs-make':('Automation','n8n vs Zapier vs Make: how usage is counted'),
'claude-vs-chatgpt-plans':('AI Assistants','Claude vs ChatGPT: what each plan includes'),
'notion-ai-vs-chatgpt-vs-claude-for-notes':('AI Productivity','Notion AI vs ChatGPT vs Claude for notes'),
'ai-coding-assistants-pricing-compared':('AI Coding','AI coding assistants: pricing compared'),
'ai-video-generators-pricing-compared':('AI Video','AI video generators: pricing and credits'),
'ai-image-generators-pricing-compared':('AI Images','AI image generators: plans and limits'),
'ai-generated-text-commercial-use':('AI Writing','Can you use AI-generated text commercially?'),
'gemini-4-argon-api-pricing-december-1':('AI Assistants','Gemini 4 Argon price doubles on Dec 1'),
'ai-meeting-notetakers-pricing-compared':('AI Meetings','AI meeting notetakers: what each charges'),
'gpt-6-2-astra-sol-explained-which-one-for-everyday-work':('AI Models','GPT-6.2 Astra and Sol'),
'googlebook-gemini-laptops-what-google-has-confirmed':('AI Hardware','Googlebook explained'),
'qwen4-max-explained-what-is-claimed':('AI Models','Qwen4-Max, explained'),
'us-hyperscale-data-centers-electricity-study-explained':('AI Infrastructure','Data center power use'),
'embodied-ai-air-factory-robot-explained':('Robots','Swiss factory robot AIR'),
'genie-4-project-genie-explained-who-can-use-it':('AI Video','Genie 4 explained'),
}
def wrap(d,t,font,maxw):
    lines=[];cur=''
    for w in t.split():
        x=(cur+' '+w).strip()
        if d.textlength(x,font=font)<=maxw: cur=x
        else: lines.append(cur); cur=w
    lines.append(cur); return lines
def fallback_bg(acc,seed):
    # Procedural branded background used when no AI background is available (no image key / generation failed).
    import random,math
    r=random.Random(seed); im=Image.new('RGB',(H,H),(14,20,34)); d=ImageDraw.Draw(im)
    for y in range(H):
        t=y/H; d.line([(0,y),(H,y)],fill=(int(14+acc[0]*0.18*t),int(20+acc[1]*0.18*t),int(34+acc[2]*0.22*t)))
    ov=Image.new('RGBA',(H,H),(0,0,0,0)); od=ImageDraw.Draw(ov)
    for _ in range(7):
        cx,cy,rad=r.randint(0,H),r.randint(0,H),r.randint(60,240)
        od.ellipse((cx-rad,cy-rad,cx+rad,cy+rad),fill=acc+(r.randint(18,48),))
    for k in range(5):
        od.line([(0,H*k//5+r.randint(-40,40)),(H,H*k//5+r.randint(-120,120))],fill=acc+(60,),width=3)
    return Image.alpha_composite(im.convert('RGBA'),ov).convert('RGB')
def make(slug,out,cat=None,head=None):
    if cat is None: cat,head=POSTS[slug]
    if cat not in ACC: ACC[cat]=(96,165,250)
    acc=ACC[cat]
    bgp=f'/tmp/covers/{slug}_bg.jpg'
    bg=(Image.open(bgp).convert('RGB').resize((H,H),Image.LANCZOS) if os.path.exists(bgp) else fallback_bg(acc,slug))
    st=ImageStat.Stat(bg.crop((0,0,40,H))); pc=tuple(int(c*0.22) for c in st.mean)
    im=Image.new('RGB',(W,H),pc); im.paste(bg,(W-H,0))
    ov=Image.new('RGBA',(W,H),(0,0,0,0)); od=ImageDraw.Draw(ov)
    x0=W-H; fw=260
    for i in range(fw):
        od.line([(x0+i,0),(x0+i,H)],fill=pc+(int(255*(1-i/fw)**1.6),))
    im=Image.alpha_composite(im.convert('RGBA'),ov); d=ImageDraw.Draw(im)
    # brand
    d.rounded_rectangle((60,56,100,96),9,fill=acc); d.text((70,59),'S',font=f('Black',30),fill=(10,16,30))
    d.text((114,60),'STACKBROOK',font=f('Bold',28),fill='white')
    # pill
    pf=f('Bold',22); tw=d.textlength(cat.upper(),font=pf)
    d.rounded_rectangle((60,150,60+tw+36,190),20,fill=acc); d.text((78,155),cat.upper(),font=pf,fill=(10,16,30))
    # headline fit
    for size in (62,58,54,50,46,42):
        hf=f('Black',size); L=wrap(d,head,hf,500)
        if len(L)<=4: break
    y=222
    for ln in L:
        d.text((60,y),ln,font=hf,fill='white'); y+=int(size*1.15)
    d.rectangle((60,H-86,150,H-80),fill=acc)
    d.text((60,H-66),'stackbrook.com',font=f('Medium',24),fill=(200,208,222))
    im.convert('RGB').save(out,quality=88,optimize=True)
if __name__=='__main__':
    import os
    os.makedirs('/tmp/covers/out',exist_ok=True)
    for s in POSTS: make(s,f'/tmp/covers/out/{s}-cover.jpg')
