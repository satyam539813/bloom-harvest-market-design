
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Package, Clock, CheckCircle } from 'lucide-react';

// For demo purposes, we'll use a simple order structure
type DemoOrder = {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
};

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    // For demo purposes, create some sample orders
    if (user) {
      const demoOrders: DemoOrder[] = [
        {
          id: 'order_demo_001',
          status: 'completed',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          items: [
            { name: 'Organic Red Apples', quantity: 2, price: 4.99 },
            { name: 'Fresh Garden Spinach', quantity: 1, price: 3.49 }
          ],
          total: 13.47
        },
        {
          id: 'order_demo_002',
          status: 'processing',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          items: [
            { name: 'Free Range Eggs', quantity: 1, price: 5.99 },
            { name: 'Heirloom Tomatoes', quantity: 3, price: 4.29 }
          ],
          total: 18.86
        }
      ];
      setOrders(demoOrders);
    }
    setLoading(false);
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Package className="h-4 w-4 text-yellow-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-3"></div>
            <p>Loading your orders...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Sign in to view orders</h3>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your order history and track your purchases.
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to see your order history here.
          </p>
          <Button onClick={() => window.location.href = '/shop'}>
            Start Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-border rounded-lg overflow-hidden">
              <div className="p-6 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                      <Badge className={`gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Track Order
                    </Button>
                    {order.status === 'completed' && (
                      <Button variant="ghost" size="sm">
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Order Details */}
              {expandedOrderId === order.id && (
                <div className="p-6 border-t border-border bg-background">
                  <h4 className="font-semibold mb-4">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-border mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
      }
    }

    fetchOrders();
  }, [user, getUserOrders]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading your orders...</p>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please sign in to view your order history.</p>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You haven't placed any orders yet.</p>
        </CardContent>
      </Card>
    );
  }

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Items</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              // Calculate order totals
              const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
              const totalPrice = order.order_items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);
              
              return (
                <React.Fragment key={order.id}>
                  <TableRow>
                    <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{totalItems}</TableCell>
                    <TableCell>${totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {/* Show order details when expanded */}
                  {expandedOrderId === order.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-gray-50">
                        <div className="px-4 py-2">
                          <h4 className="text-sm font-medium mb-2">Order Items</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product ID</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Subtotal</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.order_items.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.product_id}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>${item.price_at_purchase.toFixed(2)}</TableCell>
                                  <TableCell>${(item.price_at_purchase * item.quantity).toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
