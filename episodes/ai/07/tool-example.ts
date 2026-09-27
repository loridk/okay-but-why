type Session = { tenantId: string; canReadOrders: boolean };
type Order = { id: string; tenantId: string; status: string };

export function getOrderStatus(
  session: Session, args: unknown, orders: readonly Order[],
): { status: string } {
  if (!session.canReadOrders) throw new Error("Not allowed");
  if (typeof args !== "object" || args === null ||
      !("orderId" in args) || typeof args.orderId !== "string" ||
      !/^[0-9]{4}$/.test(args.orderId) ||
      Object.keys(args).some(key => key !== "orderId")) {
    throw new Error("Invalid arguments");
  }
  const order = orders.find(item =>
    item.id === args.orderId && item.tenantId === session.tenantId);
  if (!order) throw new Error("Order unavailable");
  return { status: order.status };
}
