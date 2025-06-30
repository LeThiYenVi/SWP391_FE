import * as signalR from "@microsoft/signalr";

let connection = null;

export const getSignalRConnection = () => connection;

export const startSignalRConnection = async (accessToken, onReceiveMessage) => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    console.log("✅ Đã kết nối SignalR.");
    return;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://snaproom-e7asc0ercvbxazb8.southeastasia-01.azurewebsites.net/chathub", {
      accessTokenFactory: () => accessToken,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  connection.on("ReceiveMessage", (message) => {
    console.log("📥 Nhận tin nhắn:", message);
    if (typeof onReceiveMessage === "function") {
      onReceiveMessage(message);
    }
  });

  try {
    await connection.start();
    console.log("✅ Kết nối SignalR thành công");
  } catch (error) {
    console.error("❌ Kết nối SignalR thất bại:", error);
  }
};

export const joinConversation = async (conversationId) => {
  const conn = getSignalRConnection();
  if (!conn || conn.state !== signalR.HubConnectionState.Connected) return;

  try {
    await conn.invoke("JoinConversation", conversationId);
    console.log(`📡 Đã tham gia nhóm: ${conversationId}`);
  } catch (error) {
    console.error("❌ Lỗi khi join group:", error);
  }
};

export const sendMessage = async (senderId, receiverId, content) => {
  const conn = getSignalRConnection();
  if (!conn || conn.state !== signalR.HubConnectionState.Connected) {
    console.warn("⚠️ Không thể gửi tin: chưa kết nối SignalR.");
    return;
  }

  try {
    await conn.invoke("SendMessage", senderId, receiverId, content);
    console.log("✅ Đã gửi tin nhắn:", content);
  } catch (error) {
    console.error("❌ Gửi tin nhắn thất bại:", error);
  }
};

export const stopSignalRConnection = async () => {
  if (!connection) return;

  try {
    await connection.stop();
    console.log("🔌 Đã ngắt kết nối SignalR.");
  } catch (error) {
    console.error("❌ Lỗi khi ngắt kết nối:", error);
  }
};
