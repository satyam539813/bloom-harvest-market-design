import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Calendar } from 'lucide-react';

const OrderHistory = () => {
  const { getUserOrders } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getUserOrders]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground text-center">
            When you place your first order, it will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
              <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {order.order_items && order.order_items.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Items:</h4>
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>Product #{item.product_id} x{item.quantity}</span>
                    <span>₹{item.price_at_purchase}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No items found</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderHistory;