
"use client";

import AppLayout from "@/components/layout/app-layout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { ChatMessage } from "@/lib/types";
import { Hash, MessageSquare, Paperclip, PlusCircle, Send, Users, UserCircle2, Search } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

const mockChannels = [
  { id: "general", name: "general", type: "public", unread: 2 },
  { id: "equipo-dev", name: "equipo-dev", type: "public", unread: 0 },
  { id: "marketing", name: "marketing", type: "public", unread: 5 },
  { id: "varios", name: "varios", type: "public", unread: 0 },
  { id: "proyecto-alfa", name: "proyecto-alfa", type: "project", unread: 1 },
];

const mockDirectMessages = [
  { id: "dm-roberto", name: "Roberto", avatarSeed: "roberto", online: true },
  { id: "dm-carol", name: "Carol", avatarSeed: "carol", online: false },
  { id: "dm-david", name: "David", avatarSeed: "david", online: true },
];

const initialMessages: ChatMessage[] = [
  { id: "msg1", channelId: "general", senderId: "roberto", content: "¡Buenos días a todos!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: "msg2", channelId: "general", senderId: "carol", content: "¡Buenos días Roberto! ¿Alguien ha visto los últimos diseños para el Proyecto Alfa?", timestamp: new Date(Date.now() - 1000 * 60 * 58).toISOString() },
  { id: "msg3", channelId: "general", senderId: "currentUser", content: "Hola Carol, acabo de compartirlos en el canal #proyecto-alfa.", timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
  { id: "msg4", channelId: "general", senderId: "david", content: "¡Gracias! Echando un vistazo ahora.", timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString() },
];

const teamMembers = [ 
    { id: "currentUser", name: "Alicia", avatarSeed: "alicia" },
    { id: "roberto", name: "Roberto", avatarSeed: "roberto" },
    { id: "carol", name: "Carol", avatarSeed: "carol" },
    { id: "david", name: "David", avatarSeed: "david" },
];

export default function CommunicationPage() {
  const [activeChannel, setActiveChannel] = useState(mockChannels[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    const msg: ChatMessage = {
      id: `msg${Date.now()}`,
      channelId: activeChannel.id,
      senderId: "currentUser", 
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage("");
  };
  
  const getSender = (senderId: string) => teamMembers.find(tm => tm.id === senderId) || {id: senderId, name: "Usuario Desconocido", avatarSeed: "unknown"};

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-var(--header-height,100px)-2rem)] border rounded-lg shadow-xl overflow-hidden">
        <div className="w-64 md:w-72 bg-card border-r flex flex-col">
          <div className="p-4 border-b">
            <Input type="search" placeholder="Buscar chats..." className="bg-background" />
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2 flex items-center justify-between">
                  CANALES <Button variant="ghost" size="icon" className="h-6 w-6"><PlusCircle className="h-4 w-4"/></Button>
                </h3>
                <ul className="space-y-1">
                  {mockChannels.map(channel => (
                    <li key={channel.id}>
                      <Button
                        variant={activeChannel.id === channel.id ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveChannel(channel)}
                      >
                        <Hash className="h-4 w-4" /> {channel.name}
                        {channel.unread > 0 && <Badge className="ml-auto bg-primary text-primary-foreground">{channel.unread}</Badge>}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                 <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2 flex items-center justify-between">
                  MENSAJES DIRECTOS <Button variant="ghost" size="icon" className="h-6 w-6"><PlusCircle className="h-4 w-4"/></Button>
                </h3>
                <ul className="space-y-1">
                  {mockDirectMessages.map(dm => (
                    <li key={dm.id}>
                      <Button
                        variant={"ghost"} 
                        className="w-full justify-start gap-2"
                      >
                        <div className="relative">
                            <Avatar className="h-6 w-6">
                                <UserCircle2 className="h-full w-full text-muted-foreground" />
                            </Avatar>
                            {dm.online && <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-accent ring-1 ring-card"/>}
                        </div>
                        {dm.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col bg-background">
          <header className="p-4 border-b flex items-center justify-between bg-card">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {activeChannel.type === "public" ? <Hash className="h-5 w-5 text-muted-foreground"/> : <UserCircle2 className="h-5 w-5 text-muted-foreground"/>}
                {activeChannel.name}
              </h2>
              <p className="text-xs text-muted-foreground">3 miembros activos</p>
            </div>
            <Button variant="ghost" size="icon"><Users className="h-5 w-5"/></Button>
          </header>

          <ScrollArea className="flex-1 p-4 space-y-6 bg-secondary/30">
            {messages.filter(m => m.channelId === activeChannel.id).map((msg, index) => {
              const sender = getSender(msg.senderId);
              const prevMessage = messages[index-1];
              const showSenderInfo = !prevMessage || prevMessage.senderId !== msg.senderId || (new Date(msg.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 5 * 60 * 1000);
              
              return (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.senderId === 'currentUser' ? 'flex-row-reverse' : ''}`}>
                  {msg.senderId !== 'currentUser' && showSenderInfo && (
                    <Avatar className="h-10 w-10">
                       <UserCircle2 className="h-full w-full text-muted-foreground" />
                    </Avatar>
                  )}
                   {msg.senderId !== 'currentUser' && !showSenderInfo && (<div className="w-10"></div>) }


                  <div className={`max-w-md lg:max-w-xl space-y-1 ${msg.senderId === 'currentUser' ? 'items-end flex flex-col' : ''}`}>
                    {showSenderInfo && (
                         <div className={`flex items-baseline gap-2 ${msg.senderId === 'currentUser' ? 'justify-end' : ''}`}>
                            <span className="font-semibold text-sm">{sender.name}</span>
                            <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    )}
                    <div className={`p-3 rounded-lg ${msg.senderId === 'currentUser' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none'}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                  
                   {msg.senderId === 'currentUser' && showSenderInfo && (
                     <Avatar className="h-10 w-10">
                       <UserCircle2 className="h-full w-full text-muted-foreground" />
                    </Avatar>
                  )}
                   {msg.senderId === 'currentUser' && !showSenderInfo && (<div className="w-10"></div>) }
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="border-t p-4 bg-card">
            <div className="relative">
              <Input 
                placeholder={`Mensaje #${activeChannel.name}`} 
                className="pr-20" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Paperclip className="h-5 w-5"/></Button>
                <Button type="submit" size="sm" className="shadow-sm"><Send className="h-4 w-4 mr-0 md:mr-2"/> <span className="hidden md:inline">Enviar</span></Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

