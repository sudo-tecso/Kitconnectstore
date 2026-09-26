import React from 'react';
import Link from 'next/link';
import { OrderRepository } from '@/lib/repositories/orders';
import { ProductRepository } from '@/lib/repositories/products';
import { CategoryRepository } from '@/lib/repositories/categories';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  History, 
  Cpu, 
  LogOut, 
  Bell, 
  HelpCircle,
  DollarSign,
  Clock,
  Activity,
  AlertTriangle,
  RefreshCw,
  Database
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const orders = await OrderRepository.getAllOrders();
  const products = await ProductRepository.getActiveProducts();
  const categories = await CategoryRepository.getAll();

  const pendingOrders = orders.filter((o) => o.order_status === 'PENDING').length;
  const readyOrders = orders.filter((o) => o.order_status === 'READY_FOR_DELIVERY' || o.order_status === 'OUT_FOR_DELIVERY').length;
  const deliveredOrders = orders.filter((o) => o.order_status === 'DELIVERED').length;
  const totalRevenue = orders
    .filter((o) => o.payment?.status === 'PAID')
    .reduce((acc, o) => acc + o.total, 0);

  const lowStockItems = products.filter((p) => {
    const qty = p.inventory ? p.inventory.quantity - p.inventory.reserved_quantity : 10;
    return qty <= (p.inventory?.low_stock_threshold || 5);
  });

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      <style dangerouslySetInnerHTML={{__html: `
        .trace-line {
            background: linear-gradient(90deg, #b4c5ff 0%, transparent 100%);
            box-shadow: 0 0 8px #b4c5ff;
        }
        .pulse-glow {
            animation: pulse-glow 1.6s infinite alternate;
        }
        @keyframes pulse-glow {
            0% { box-shadow: 0 0 0 0 rgba(47,111,255,0.0); }
            100% { box-shadow: 0 0 20px 0 rgba(47,111,255,0.15); }
        }
        .connect-blue-glow:hover {
            box-shadow: 0 0 30px rgba(47,111,255,0.08);
        }
      `}} />
      
      {/* SideNavBar */}
      <nav className="bg-graphite-1 text-primary h-screen w-64 fixed left-0 top-0 border-r border-border-line flex flex-col p-3 space-y-2 z-50">
        <div className="mb-7 px-2 pt-4">
          <h1 className="font-display text-lg font-bold text-on-surface">Precision Admin</h1>
          <p className="font-mono text-[10px] tracking-widest text-slate mt-1 uppercase">Hardware Node: 01</p>
        </div>
        <div className="flex-grow space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 bg-secondary-container text-on-secondary-container rounded-lg transition-all duration-150 ease-in-out text-sm font-semibold">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-lg transition-all duration-150 ease-in-out text-sm font-semibold">
            <Package size={18} />
            <span>Product Catalog</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-lg transition-all duration-150 ease-in-out text-sm font-semibold">
            <Receipt size={18} />
            <span>Order Queue</span>
          </Link>
          <Link href="/admin/inventory" className="flex items-center space-x-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-lg transition-all duration-150 ease-in-out text-sm font-semibold">
            <History size={18} />
            <span>Inventory Log</span>
          </Link>
          <Link href="/admin/system" className="flex items-center space-x-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-lg transition-all duration-150 ease-in-out text-sm font-semibold">
            <Cpu size={18} />
            <span>System Health</span>
          </Link>
        </div>
        <div className="mt-auto pt-4 space-y-4 border-t border-border-line">
          <button className="w-full bg-primary-container text-on-primary-container rounded-lg py-2 text-sm font-semibold transition-colors hover:opacity-90">
            New Requisition
          </button>
          <Link href="/logout" className="flex items-center space-x-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-lg transition-all duration-150 ease-in-out text-sm font-semibold">
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* TopNavBar */}
        <header className="bg-graphite-1 h-16 border-b border-border-line flex justify-between items-center px-8 w-full sticky top-0 z-40">
          <div className="hidden md:flex items-center space-x-4">
            <span className="font-mono text-[11px] text-slate uppercase tracking-widest">KitConnect / Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-200">
              <Bell size={20} />
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-200">
              <HelpCircle size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-border-line">
              <img alt="Administrator profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjMm-e7efzhJ3tsM62SFHQP4kxK8mcN266WJyiyNLS1BdQEOzy-llKi42Zq0jazeqVZAjHw0wGYzY54FOiwSxIIiSa7ntHtQK6451vJXcPnA1bUBor6D4SiVqcn8n83SnVaX6Ewr7YMruI5cN5RMXTVVEbu47lBG3K2w_lwDSs6KxtoPO5LJbj86DAVPVe2wuLaLDNqIH3HJRPGbzJaF5CnkGl7iEcRx-J0dlj6FFiw2x8fRlRldNIKg" />
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="p-8 max-w-[1400px] mx-auto w-full space-y-14 pb-32">
          {/* Page Header */}
          <div>
            <h2 className="font-display text-4xl font-bold text-on-surface mb-2">System Overview</h2>
            <div className="h-[2px] w-32 trace-line mb-4"></div>
            <p className="text-sm text-slate">Real-time telemetry and operational metrics for KitConnect Node 01.</p>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Daily Revenue */}
            <div className="bg-graphite-2 rounded-xl border border-border-line p-5 relative overflow-hidden group connect-blue-glow transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-[34px] h-[34px] rounded-full bg-graphite-1 flex items-center justify-center">
                    <DollarSign className="text-primary" size={16} />
                  </div>
                  <span className="font-mono text-[10px] text-slate uppercase tracking-widest">Paid Revenue</span>
                </div>
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">+14.2%</span>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-on-surface mb-1">GHS {totalRevenue.toFixed(2)}</div>
                <div className="text-xs font-semibold text-slate">Vol: {deliveredOrders} Fulfilled</div>
              </div>
            </div>

            {/* Pending Requisitions */}
            <div className="bg-graphite-2 rounded-xl border border-border-line p-5 relative overflow-hidden group connect-blue-glow transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-[34px] h-[34px] rounded-full bg-graphite-1 flex items-center justify-center">
                    <Clock className="text-tertiary" size={16} />
                  </div>
                  <span className="font-mono text-[10px] text-slate uppercase tracking-widest">Pending Requisitions</span>
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-on-surface mb-1">{pendingOrders}</div>
                <div className="text-xs font-semibold text-slate">Total Orders: {orders.length}</div>
              </div>
            </div>

            {/* System Health / Low Stock */}
            <div className="bg-graphite-2 rounded-xl border border-border-line p-5 relative overflow-hidden group pulse-glow transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-[34px] h-[34px] rounded-full bg-graphite-1 flex items-center justify-center">
                    <Activity className="text-secondary" size={16} />
                  </div>
                  <span className="font-mono text-[10px] text-slate uppercase tracking-widest">Low Stock Alerts</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={\`w-2 h-2 rounded-full \${lowStockItems.length > 0 ? 'bg-amber-400' : 'bg-primary'} animate-pulse\`}></div>
                  <span className={\`text-xs \${lowStockItems.length > 0 ? 'text-amber-400' : 'text-primary'}\`}>
                    {lowStockItems.length > 0 ? 'Attention' : 'Optimal'}
                  </span>
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-on-surface mb-1">{lowStockItems.length} Items</div>
                <div className="text-xs font-semibold text-slate">Threshold &lt;= 5</div>
              </div>
            </div>
          </div>

          {/* Main Chart Area & Recent Events Bento */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Trend Chart */}
            <div className="lg:col-span-2 bg-graphite-2 rounded-xl border border-border-line p-5 relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-on-surface">Revenue Velocity</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs font-semibold rounded-full bg-surface-variant text-on-surface">24H</button>
                  <button className="px-3 py-1 text-xs font-semibold rounded-full bg-graphite-1 text-slate border border-border-line">7D</button>
                  <button className="px-3 py-1 text-xs font-semibold rounded-full bg-graphite-1 text-slate border border-border-line">30D</button>
                </div>
              </div>
              {/* Abstract representation of a chart using divs and gradients */}
              <div className="h-64 w-full relative flex items-end justify-between space-x-1 pb-6 border-b border-border-line border-l pl-4">
                {/* Y Axis labels */}
                <div className="absolute left-[-30px] top-0 bottom-6 flex flex-col justify-between font-mono text-[10px] text-slate">
                  <span>25k</span>
                  <span>20k</span>
                  <span>15k</span>
                  <span>10k</span>
                  <span>5k</span>
                </div>
                {/* Chart Bars/Lines */}
                <div className="w-full h-full relative">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path className="drop-shadow-[0_0_8px_rgba(47,111,255,0.8)]" d="M0,80 Q20,60 40,70 T80,40 T100,20" fill="none" stroke="url(#blue-gradient)" strokeWidth="2"></path>
                    <defs>
                      <linearGradient id="blue-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stopColor="#343537"></stop>
                        <stop offset="50%" stopColor="#b4c5ff"></stop>
                        <stop offset="100%" stopColor="#a9c7ff"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="w-full h-px bg-slate"></div>
                    <div className="w-full h-px bg-slate"></div>
                    <div className="w-full h-px bg-slate"></div>
                    <div className="w-full h-px bg-slate"></div>
                    <div className="w-full h-px bg-slate"></div>
                  </div>
                </div>
                {/* X Axis labels */}
                <div className="absolute bottom-0 left-4 right-0 flex justify-between font-mono text-[10px] text-slate pt-2">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            {/* Recent Critical Events */}
            <div className="bg-graphite-2 rounded-xl border border-border-line p-5 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-on-surface">Critical Events</h3>
                <button className="text-primary text-sm hover:underline font-semibold">View All</button>
              </div>
              <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                {/* Event Item 1 */}
                <div className="flex items-start space-x-3 pb-4 border-b border-border-line">
                  <div className="mt-1 w-[34px] h-[34px] shrink-0 rounded-full bg-error/10 flex items-center justify-center border border-error/20">
                    <AlertTriangle className="text-error" size={16} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-on-surface mb-1">Low Stock Warning</div>
                    <div className="text-[14px] text-slate text-xs mb-2">
                      {lowStockItems.length > 0 
                        ? lowStockItems.length + ' items are currently at or below the minimum threshold.' 
                        : 'No items are critically low on stock.'}
                    </div>
                  </div>
                </div>
                
                {/* Recent Order */}
                {orders.length > 0 && (
                  <div className="flex items-start space-x-3 pb-4 border-b border-border-line">
                    <div className="mt-1 w-[34px] h-[34px] shrink-0 rounded-full bg-surface-variant flex items-center justify-center border border-border-line">
                      <RefreshCw className="text-secondary" size={16} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-on-surface mb-1">Recent Order: {orders[0].order_reference}</div>
                      <div className="text-[14px] text-slate text-xs mb-2">Order placed by {orders[0].customer_name} for GHS {orders[0].total.toFixed(2)}.</div>
                      <div className="font-mono text-[10px] text-slate opacity-70">
                        {new Date(orders[0].created_at || Date.now()).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* System DB */}
                <div className="flex items-start space-x-3">
                  <div className="mt-1 w-[34px] h-[34px] shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Database className="text-primary" size={16} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-on-surface mb-1">Database Sync</div>
                    <div className="text-[14px] text-slate text-xs mb-2">System connected to DB successfully.</div>
                    <div className="font-mono text-[10px] text-slate opacity-70">
                      System Time
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
