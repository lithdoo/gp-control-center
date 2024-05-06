mod client;
mod port;
use tokio::{join};

use axum::{
    routing::get,
    Router,
};

use port::get_available_port;

#[tokio::main]
async fn main() {
    // build our application with a single route

    let port = if let Some(port) = get_available_port() {
        port
    } else {
        return;
    };

    join!(start_server(port), client::heatbeat(),);
    // try_join!(heatbeat(),||axum::serve(listener, app).await.unwrap())
}

async fn start_server(port: u16) {
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/ws", get(client::ws_handler));

    println!("127.0.0.1:{}", port);

    let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{}", port))
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}
