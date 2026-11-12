import sys, json
from PIL import Image, ImageDraw, ImageFont, ImageStat
F='/usr/share/fonts/opentype/inter/Inter-%s.otf'
f=lambda w,s: ImageFont.truetype(F%w,s)
W,H=1200,630
ACC={'CRM':(76,201,240),'Automation':(255,138,61),'AI Coding':(167,139,250),'AI Video':(244,114,182),'AI Images':(250,204,21),
     'AI Writing':(52,211,153),'AI Assistants':(251,146,120),'AI Productivity':(45,212,191),'AI Meetings':(129,140,248),
     'AI Explainers':(96,165,250),'AI Hardware':(251,191,36),'Robots':(248,113,113),'AI Safety':(74,222,128),'AI Presentations':(232,121,249)}
POSTS={
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
}
def wrap(d,t,font,maxw):
    lines=[];cur=''
    for w in t.split():
        x=(cur+' '+w).strip()
        if d.textlength(x,font=font)<=maxw: cur=x
        else: lines.append(cur); cur=w
    lines.append(cur); return lines
def make(slug,out):
    cat,head=POSTS[slug]; acc=ACC[cat]
    bg=Image.open(f'/tmp/covers/{slug}_bg.jpg').convert('RGB').resize((H,H),Image.LANCZOS)
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
