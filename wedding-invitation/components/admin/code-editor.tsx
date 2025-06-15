"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import Editor from "@monaco-editor/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CodeEditorProps {
  language?: string
  value?: string
  onChange?: (value: string | undefined) => void
}

export function CodeEditor({ language = "html", value = "", onChange }: CodeEditorProps) {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState("html")

  const htmlCode = `<div class="wedding-card">
  <header>
    <h1>Minh & Hoa</h1>
    <p class="date">12.05.2023</p>
  </header>
  
  <main>
    <p class="invitation">
      Trân trọng kính mời
    </p>
    
    <p class="message">
      Tới dự lễ thành hôn của chúng tôi
    </p>
    
    <div class="details">
      <div class="detail">
        <h3>Thời gian</h3>
        <p>10:00 AM, 12/05/2023</p>
      </div>
      
      <div class="detail">
        <h3>Địa điểm</h3>
        <p>Trung tâm tiệc cưới XYZ</p>
        <p>123 Đường ABC, Quận DEF</p>
      </div>
    </div>
    
    <button id="rsvp-btn">Xác nhận tham dự</button>
  </main>
  
  <footer>
    <p>Rất hân hạnh được đón tiếp</p>
  </footer>
</div>`

  const cssCode = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Times New Roman', serif;
  background-color: #fdf2f8;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.wedding-card {
  max-width: 500px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
}

header {
  margin-bottom: 30px;
}

h1 {
  font-size: 36px;
  color: #db2777;
  margin-bottom: 10px;
}

.date {
  font-size: 18px;
  color: #9d174d;
  font-style: italic;
}

main {
  margin-bottom: 30px;
}

.invitation {
  font-size: 24px;
  margin-bottom: 20px;
  color: #9d174d;
}

.message {
  font-size: 18px;
  margin-bottom: 30px;
}

.details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.detail {
  flex: 1;
  padding: 0 10px;
}

.detail h3 {
  font-size: 16px;
  color: #db2777;
  margin-bottom: 10px;
}

#rsvp-btn {
  background-color: #db2777;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

#rsvp-btn:hover {
  background-color: #9d174d;
}

footer {
  font-style: italic;
  color: #9d174d;
}`

  const jsCode = `document.addEventListener('DOMContentLoaded', function() {
  const rsvpButton = document.getElementById('rsvp-btn');
  
  rsvpButton.addEventListener('click', function() {
    alert('Cảm ơn bạn đã xác nhận tham dự!');
    // Đây là nơi bạn có thể thêm mã để gửi form xác nhận tham dự
  });
});`

  // Nếu component được sử dụng với một tab cụ thể
  if (language) {
    return (
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        theme={theme === "dark" ? "vs-dark" : "vs-light"}
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2,
          folding: true,
        }}
      />
    )
  }

  // Nếu component được sử dụng với tabs
  const codeMap = {
    html: htmlCode,
    css: cssCode,
    js: jsCode,
  }

  return (
    <Tabs defaultValue="html" className="h-full" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="html">HTML</TabsTrigger>
        <TabsTrigger value="css">CSS</TabsTrigger>
        <TabsTrigger value="js">JavaScript</TabsTrigger>
      </TabsList>
      {["html", "css", "js"].map((tab) => (
        <TabsContent key={tab} value={tab} className="h-[calc(100%-40px)]">
          <Editor
            height="100%"
            defaultLanguage={tab === "js" ? "javascript" : tab}
            theme={theme === "dark" ? "vs-dark" : "vs-light"}
            value={codeMap[tab as keyof typeof codeMap]}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              tabSize: 2,
              folding: true,
            }}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
