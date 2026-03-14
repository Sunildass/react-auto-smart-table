export const EXAMPLE_DATASETS = {
  users: [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", active: true, joined: "2023-01-15", revenue: 1540.50 },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor", active: false, joined: "2023-05-20", revenue: 450.00 },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", active: true, joined: "2024-02-10", revenue: 0.00 },
    { id: 4, name: "Diana Ross", email: "diana@example.com", role: "Admin", active: true, joined: "2022-11-30", revenue: 8900.25 }
  ],
  orders: [
    { order_id: "ORD-101", customer: "Globex Corp", status: "Delivered", amount: 12000, date: "2024-03-01", expedited: true },
    { order_id: "ORD-102", customer: "Initech", status: "Pending", amount: 450, date: "2024-03-05", expedited: false },
    { order_id: "ORD-103", customer: "Umbrella Co", status: "Cancelled", amount: 3200, date: "2024-02-15", expedited: true },
    { order_id: "ORD-104", customer: "Hooli", status: "Delivered", amount: 890, date: "2024-03-10", expedited: false }
  ],
  analytics: [
    { page: "/home", visitors: 4500, duration: 120, bounce_rate: 0.35, date: "2024-03-10" },
    { page: "/pricing", visitors: 1200, duration: 340, bounce_rate: 0.12, date: "2024-03-10" },
    { page: "/docs", visitors: 2800, duration: 450, bounce_rate: 0.05, date: "2024-03-10" },
    { page: "/blog/post-1", visitors: 800, duration: 90, bounce_rate: 0.65, date: "2024-03-10" }
  ]
};
