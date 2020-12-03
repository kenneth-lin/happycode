import tkinter as tk
import subprocess as sub
import sys
sys.path.append(r'./')
from time import strftime, localtime
import tkinter.scrolledtext as scrolledtext
import threading
import webbrowser

class AddLink:  

    def UI(self):
        root = tk.Tk()
        root.title("Add link tool")
        root.geometry("520x400")
        root.bind("<Escape>",self.clearPad)

        label=tk.Label(root,text='Title:')
        self.editTitle=tk.Text(root,width=62,height=1)
        labelURL=tk.Label(root,text='Url:')
        self.editUrl=tk.Text(root,width=62,height=1)
        labelContent=tk.Label(root,text='Content:')
        self.editContent=tk.Text(root,width=62,height=1)
        self.btnCrawler=tk.Button(root,text='Crawler',width=10,height=1, command = lambda: self.startCrawlerThread(None))
        self.btnOpenBlog=tk.Button(root,text='Open Blog',width=10,height=1, command = lambda: self.openBlog(None))
        self.btnOpenAdmin=tk.Button(root,text='Open Admin',width=10,height=1, command = lambda: self.openAdmin(None))
        self.scrollLogText = scrolledtext.ScrolledText(root,width=68,height=20)
        self.scrollLogText.config(state='disable')

        label.place(x=10,y=10)
        self.editTitle.place(x=70,y=10)
        labelURL.place(x=10,y=35)
        self.editUrl.place(x=70,y=35)
        labelContent.place(x=10,y=60)
        self.editContent.place(x=70,y=60)
        self.btnCrawler.place(x=430,y=83)
        self.btnOpenBlog.place(x=10,y=83)
        self.btnOpenAdmin.place(x=100,y=83)
        self.scrollLogText.place(x=10,y=115)

        root.resizable(False, False)
        root.mainloop()

    def startCrawlerThread(self,event):
        threadRun = threading.Thread(target=self.startCrawler)
        threadRun.start()
        return

    def startCrawler(self):
        title = self.editTitle.get("1.0",'end')
        url = self.editUrl.get("1.0",'end')
        content = self.editContent.get("1.0",'end')
        title = title.replace("\n","")
        url = url.replace("\n","")
        content = content.replace("\n","")
        if title == "" or url == "":
            self.logpadInsert("Title or Url is empty")
            return
        self.btnCrawler.config(state="disable")
        self.logpadInsert("Crawler start:" + url)
        commandArr = ["crawler.bat",url,title,content]
        p = sub.Popen(commandArr,shell=True, stdout=sub.PIPE, stderr=sub.PIPE, stdin=sub.PIPE)
        output, errors = p.communicate()
        self.logpadInsert("Crawler Done!")
        self.btnCrawler.config(state="normal")

    def logpadInsert(self,strings):
        timestr = strftime("%Y-%m-%d %H:%M:%S", localtime())
        strings = timestr + "   " + str(strings)
        self.scrollLogText.config(state='normal')
        self.scrollLogText.insert("end",str(strings+'\n'))
        self.scrollLogText.config(state='disable')
        self.scrollLogText.see('end')
        self.scrollLogText.update()

    def clearPad(self,event):
        self.scrollLogText.config(state='normal')
        self.scrollLogText.delete('1.0', 'end')
        self.scrollLogText.config(state='disable')
        self.scrollLogText.see('end')
        self.scrollLogText.update()
    
    def openBlog(self,event):
        webbrowser.open("http://localhost:4000/")

    def openAdmin(self,event):
        webbrowser.open("http://localhost:4000/admin")

if __name__ == '__main__':
    main = AddLink()
    main.UI()