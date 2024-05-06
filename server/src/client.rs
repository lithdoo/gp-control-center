use std::{collections::HashMap, time::Duration};

use async_mutex::Mutex;
use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::Response,
};
use futures::{
    stream::{SplitSink, SplitStream},
    SinkExt, StreamExt,
};
use once_cell::sync::Lazy;
use tokio::time;
use uuid::Uuid;

static CLIENT_CENTER: Lazy<Mutex<ClientCenter>> = Lazy::new(|| {
    let m: ClientCenter = ClientCenter::new();
    // m.insert(13, "Spica".to_string());
    // m.insert(74, "Hoyten".to_string());
    Mutex::new(m)
});

struct ClientCenter {
    clients: HashMap<String, AppClient>,
}

impl ClientCenter {
    fn new() -> ClientCenter {
        ClientCenter {
            clients: HashMap::new(),
        }
    }
    async fn send(&mut self, id: &String, message: Message) {
        if let Some(client) = self.clients.get_mut(id) {
            client.sender.send(message).await.unwrap()
        }
    }

    async fn heartbeat(&mut self) {
        for client in self.clients.values_mut() {
            println!("heartbeat: {}", client.id);
            if client.sender.send(Message::Ping(Vec::new())).await.is_err() {
                client.state = ClientState::Disconnected;
            };
        }
    }
}

enum ClientState {
    BeforeConnect,
    Disconnected,
}

struct AppClient {
    id: Uuid,
    sender: SplitSink<WebSocket, Message>,
    state: ClientState,
}

pub async fn heatbeat() {
    let mut interval = time::interval(Duration::from_secs(3));

    loop {
        interval.tick().await;
        println!("heatbeat0");
        let mut unwrap = CLIENT_CENTER.lock().await;
        unwrap.heartbeat().await;
    }
}

pub async fn ws_handler(ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(socket: WebSocket) {
    let (sender, receiver) = socket.split();
    let id = Uuid::new_v4();
    let id_str = id.to_string();
    init_sender(sender, id).await;
    init_receiver(receiver, &id_str).await;
}

async fn init_receiver(mut receiver: SplitStream<WebSocket>, id: &String) {
    println!("ws connect: {}", id);

    while let Some(Ok(msg)) = receiver.next().await {
        match msg {
            Message::Close(_) => {
                println!("客户端断开连接");
                break;
            }
            Message::Text(text) => {
                println!("收到客户端文本消息：{}", text);
                // 通过管道，将接收到的消息传递给发送句柄
                // tx.send(Message::Text(text)).await.unwrap();

                if text == "!Connect" {
                    CLIENT_CENTER
                        .lock()
                        .await
                        .send(id, Message::Text("!Connect:".to_owned() + id))
                        .await;
                };
                CLIENT_CENTER
                    .lock()
                    .await
                    .send(id, Message::Text("get daze※".to_owned()))
                    .await;
            }
            _ => println!("收到客户端消息：{:?}", msg),
        };
    }
}

async fn init_sender(sender: SplitSink<WebSocket, Message>, id: Uuid) {
    let client = AppClient {
        sender,
        state: ClientState::BeforeConnect,
        id,
    };
    let mut center = CLIENT_CENTER.lock().await;
    center.clients.insert(client.id.to_string(), client);
}
