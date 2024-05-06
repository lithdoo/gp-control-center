// use std::collections::HashMap;
// type EventCallback = Box<dyn Fn()>;

// pub struct EventCenter {
//     /// 事件-监听器数组容器
//     _events: HashMap<String, Vec<EventCallback>>,
// }
// impl EventCenter {
//     pub fn new() -> EventCenter {
//         EventCenter {
//             _events: HashMap::new(),
//         }
//     }
//     /// 添加事件监听器，监听器是一个回调函数，表示用户订阅的具体服务
//     fn add_listener(&mut self, event: &str, callback: EventCallback) {
//         let callbacks = self._events.entry(event.to_string()).or_default();
//         callbacks.push(callback);
//     }

//     /// 移除事件监听器：相当于用户取消订阅
//     // fn remove_listener(&mut self, event: &str, callback: &EventCallback) {
//     //     if let Some(callbacks) = self._events.get_mut(event) {
//     //         callbacks.retain(|cb| cb != callback);
//     //     }
//     // }
//     /// 触发事件：相当于发布消息或服务，也就是事件发生时，将订阅者订阅的服务一一为订阅者执行
//     fn emit(&self, event: &str) {
//         if let Some(callbacks) = self._events.get(event) {
//             for callback in callbacks {
//                 callback();
//             }
//         }
//     }
// }
