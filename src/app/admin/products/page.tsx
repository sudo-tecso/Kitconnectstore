import React from 'react';
import {
  LayoutDashboard,
  Package,
  Receipt,
  ClipboardList,
  Cpu,
  Plus,
  LogOut,
  Menu,
  Download,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ProductCatalogPage() {
  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .trace-line {
            height: 2px;
            background: linear-gradient(90deg, #b4c5ff, transparent);
            box-shadow: 0 0 8px rgba(47, 111, 255, 0.4);
        }
        
        .interactive-glow:hover {
            box-shadow: inset 0 0 40px rgba(47, 111, 255, 0.08);
            border-color: rgba(180, 197, 255, 0.3);
        }

        .pulse-active {
            animation: pulse-glow 1.6s infinite;
        }

        @keyframes pulse-glow {
            0% { box-shadow: 0 0 0 0 rgba(47, 111, 255, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(47, 111, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(47, 111, 255, 0); }
        }
      `}} />
      {/* Sidebar */}
      
{/* SideNavBar (Desktop Only) */}
<aside className="bg-graphite-1 dark:bg-graphite-1 text-primary dark:text-primary font-label-ui text-label-ui h-screen w-64 fixed left-0 top-0 border-r border-border-line hidden md:flex flex-col p-grid-gutter space-y-tight-gap z-50">
<div className="mb-stack-gap flex items-center space-x-3 px-2 mt-4">
<div className="w-10 h-10 rounded-full bg-graphite-2 border border-border-line flex items-center justify-center overflow-hidden">
<img alt="System Administrator" className="w-full h-full object-cover" data-alt="A macro shot of a sleek, dark metallic server node interface with subtle blue LED indicator lights glowing gently in a dark room. The aesthetic is highly technical, premium, and futuristic, evoking electronic precision." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQjmlu58ecyMiJfcfSp6CiHOVLEiGRqsoUxgtVsILJEVBr9Tgxvb7FDtjr7YNJxYPFV0pxt_uVLOUgc8llqZetgcft-KnAE51kbEchCJU_ROfBC9rQbDPbEF0rSwFWBRh0xZE8fz8ywHes6Qg9Ev3OFUtWNgkPYVkIsqaHDRIKCHyKvqhQvegFT2m4fo3fLnweZoyk8X4zdyBUuWx30ENpejKU9KGRC__MfFf514KSm1v5H5LSGddI1g"/>
</div>
<div>
<div className="font-display text-headline-md text-on-surface tracking-tighter">Precision Admin</div>
<div className="font-micro-mono text-micro-mono text-slate uppercase mt-1">Hardware Node: 01</div>
</div>
</div>
<nav className="flex-1 space-y-2">
<a className="flex items-center space-x-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all duration-150 ease-in-out group" href="#">
<LayoutDashboard className="w-5 h-5 group-hover:text-on-surface transition-colors duration-150" data-weight="regular"  />
<span className="group-hover:text-on-surface transition-colors duration-150">Dashboard</span>
</a>
<a className="flex items-center space-x-3 px-3 py-2 bg-secondary-container text-on-secondary-container rounded-lg transition-all duration-150 ease-in-out group relative overflow-hidden" href="#">
<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-primary rounded-r-full"></div>
<Package className="w-5 h-5" data-weight="fill"  />
<span>Product Catalog</span>
</a>
<a className="flex items-center space-x-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all duration-150 ease-in-out group" href="#">
<Receipt className="w-5 h-5 group-hover:text-on-surface transition-colors duration-150" data-weight="regular"  />
<span className="group-hover:text-on-surface transition-colors duration-150">Order Queue</span>
</a>
<a className="flex items-center space-x-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all duration-150 ease-in-out group" href="#">
<ClipboardList className="w-5 h-5 group-hover:text-on-surface transition-colors duration-150" data-weight="regular"  />
<span className="group-hover:text-on-surface transition-colors duration-150">Inventory Log</span>
</a>
<a className="flex items-center space-x-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all duration-150 ease-in-out group" href="#">
<Cpu className="w-5 h-5 group-hover:text-on-surface transition-colors duration-150" data-weight="regular"  />
<span className="group-hover:text-on-surface transition-colors duration-150">System Health</span>
</a>
</nav>
<div className="mt-auto space-y-4">
<button className="w-full bg-primary-container text-on-primary-container font-label-ui text-label-ui py-2.5 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity">
<Plus className="w-[18px] h-[18px]"  />
<span>New Requisition</span>
</button>
<div className="pt-4 border-t border-border-line">
<a className="flex items-center space-x-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all duration-150 ease-in-out group" href="#">
<LogOut className="w-5 h-5 group-hover:text-on-surface transition-colors duration-150" data-weight="regular"  />
<span className="group-hover:text-on-surface transition-colors duration-150">Logout</span>
</a>
</div>
</div>
</aside>
{/* Main Content Area */}
<main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden bg-background">
{/* Mobile Top Nav (Hidden on Desktop) */}
<header className="md:hidden bg-graphite-1 dark:bg-graphite-1 w-full h-16 flex justify-between items-center px-component-padding border-b border-border-line z-40 sticky top-0">
<div className="font-display text-headline-md font-bold text-primary tracking-tighter">PRECISION ENGINE</div>
<button className="text-on-surface-variant hover:text-primary transition-colors duration-200">
<Menu className=""  />
</button>
</header>
{/* Page Content */}
<div className="flex-1 overflow-y-auto p-component-padding md:p-edge-margin relative">
{/* Page Header */}
<div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-gap gap-4">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Product Catalog</h1>
<p className="font-body-md text-body-md text-slate mt-1">Manage and monitor KitConnect hardware inventory across all nodes.</p>
</div>
<div className="flex items-center space-x-3">
<button className="bg-graphite-2 border border-border-line text-on-surface px-4 py-2 rounded-lg font-label-ui text-label-ui flex items-center space-x-2 hover:bg-surface-variant transition-colors">
<Download className="w-[18px] h-[18px]"  />
<span>Export CSV</span>
</button>
</div>
</div>
{/* The Trace Separator */}
<div className="trace-line w-full mb-section-gap"></div>
{/* Toolbar (Search & Filters) */}
<div className="bg-graphite-1 rounded-xl border border-border-line p-4 mb-stack-gap flex flex-col lg:flex-row gap-4 items-center">
{/* Search */}
<div className="relative w-full lg:w-96">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<Search className="text-slate w-5 h-5"  />
</div>
<input className="w-full bg-graphite-2 border border-border-line rounded-lg pl-10 pr-4 py-2.5 text-on-surface font-body-md text-body-md placeholder-slate focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Search SKU, Product Name, or Category..." type="text"/>
</div>
{/* Filters */}
<div className="flex flex-wrap items-center gap-3 w-full lg:w-auto ml-auto">
<div className="flex items-center space-x-2">
<span className="font-micro-mono text-micro-mono text-slate uppercase">Category:</span>
<select className="bg-graphite-2 border border-border-line rounded-lg px-3 py-2 text-on-surface font-label-ui text-label-ui focus:outline-none focus:border-primary appearance-none pr-8 relative">
<option>All Categories</option>
<option>Core Modules</option>
<option>Sensors</option>
<option>Power Units</option>
</select>
</div>
<div className="flex items-center space-x-2">
<span className="font-micro-mono text-micro-mono text-slate uppercase">Status:</span>
<select className="bg-graphite-2 border border-border-line rounded-lg px-3 py-2 text-on-surface font-label-ui text-label-ui focus:outline-none focus:border-primary appearance-none pr-8">
<option>All Statuses</option>
<option>In Stock</option>
<option>Low Stock</option>
<option>Out of Stock</option>
</select>
</div>
<button className="bg-graphite-2 border border-border-line w-10 h-10 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-colors" title="Grid View">
<LayoutGrid className="w-5 h-5"  />
</button>
<button className="bg-secondary-container border border-secondary-container w-10 h-10 rounded-lg flex items-center justify-center text-on-secondary-container" title="List View">
<List className="w-5 h-5"  />
</button>
</div>
</div>
{/* Data Table */}
<div className="bg-graphite-1 rounded-xl border border-border-line overflow-hidden">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-border-line bg-graphite-2">
<th className="px-6 py-4 font-micro-mono text-micro-mono text-slate uppercase tracking-wider">SKU</th>
<th className="px-6 py-4 font-micro-mono text-micro-mono text-slate uppercase tracking-wider">Product Information</th>
<th className="px-6 py-4 font-micro-mono text-micro-mono text-slate uppercase tracking-wider">Category</th>
<th className="px-6 py-4 font-micro-mono text-micro-mono text-slate uppercase tracking-wider">Stock Level</th>
<th className="px-6 py-4 font-micro-mono text-micro-mono text-slate uppercase tracking-wider text-right">Unit Price</th>
<th className="px-6 py-4 font-micro-mono text-micro-mono text-slate uppercase tracking-wider text-center">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-border-line">
{/* Row 1: In Stock */}
<tr className="hover:bg-graphite-2 transition-colors interactive-glow group">
<td className="px-6 py-4 whitespace-nowrap">
<span className="font-data-mono text-data-mono text-on-surface-variant">KC-CORE-001</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center space-x-3">
<div className="w-10 h-10 rounded bg-graphite-2 border border-border-line p-1 relative overflow-hidden flex-shrink-0">
<div className="absolute inset-0 bg-primary opacity-5 rounded-full blur-md"></div>
<img alt="Core Processing Unit V2" className="w-full h-full object-contain relative z-10" data-alt="A macro studio shot of a small, sleek matte black electronic circuit board module with silver connector pins, resting on a dark surface under dramatic, technical studio lighting with a subtle blue rim light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT9pZB7oBPlFGmJdtLkOaxQHZTSYPa2bNmJjXAnu02acbs64dp62nPNKne9mKoZPIcvWzrWD2edNv4u7SbVXf_PSRad4-pVQfQME-zRq0EqGQbo2j79POnTLwhDVmUFJknWl8sIdzsw-tioSwSwKVcMkLrYqABVpCooRKQtoI3PCkBAqCghsodYD4g__Srle3UQWim0HenSsRtETl2opNisIIxQKCzvc0JmUUV9Yg0TrTc5rrsC4L2Fg"/>
</div>
<div>
<div className="font-label-ui text-label-ui text-on-surface">Core Processing Unit V2</div>
<div className="font-body-md text-[13px] text-slate mt-0.5">High-frequency compute module</div>
</div>
</div>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="inline-flex items-center px-2 py-1 rounded-md bg-surface-variant text-on-surface-variant font-label-ui text-[12px]">Core Modules</span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center space-x-2">
<div className="w-2 h-2 rounded-full bg-[#4ade80]"></div>
<span className="font-data-mono text-data-mono text-on-surface">1,245</span>
<span className="font-body-md text-[13px] text-slate">Units</span>
</div>
</td>
<td className="px-6 py-4 whitespace-nowrap text-right">
<span className="font-data-mono text-data-mono text-on-surface">$299.00</span>
</td>
<td className="px-6 py-4 whitespace-nowrap text-center">
<button className="text-slate hover:text-primary transition-colors p-1">
<MoreVertical className="w-5 h-5"  />
</button>
</td>
</tr>
{/* Row 2: Low Stock */}
<tr className="hover:bg-graphite-2 transition-colors interactive-glow group">
<td className="px-6 py-4 whitespace-nowrap">
<span className="font-data-mono text-data-mono text-on-surface-variant">KC-SENS-042</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center space-x-3">
<div className="w-10 h-10 rounded bg-graphite-2 border border-border-line p-1 relative overflow-hidden flex-shrink-0">
<div className="absolute inset-0 bg-primary opacity-5 rounded-full blur-md"></div>
<img alt="LiDAR Array Micro" className="w-full h-full object-contain relative z-10" data-alt="A close-up studio product shot of a miniature metallic sensor component, cylindrical with a glass lens on top. It sits on a dark, reflective surface illuminated by a crisp, cool white light, emphasizing its precise engineering." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJtHJ2ZQwltc21imf2MBm6u0mKrEa-DSeLQx7vmRIkUIG9M80xkOdKr4wrV3xCY-gXNGw2m6jILEp3ZQGUt0iwx2mxgiDUXKGal16AhCh5imPVMcVXD7trJ30HW71Y2aEZ_8kEyxBecNvDWTEJ3N5TFprgJtzX-WGFlFMY13zq24PbxURc4bnn0UUJYJLpCFDhnSPJR6dpfw7t2RWdxHy2VtYz0Q_rUD8WY6SW8EA37Xf4XFRhksXbqw"/>
</div>
<div>
<div className="font-label-ui text-label-ui text-on-surface">LiDAR Array Micro</div>
<div className="font-body-md text-[13px] text-slate mt-0.5">Short-range spatial mapping</div>
</div>
</div>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="inline-flex items-center px-2 py-1 rounded-md bg-surface-variant text-on-surface-variant font-label-ui text-[12px]">Sensors</span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center space-x-2">
<div className="w-2 h-2 rounded-full bg-[#fbbf24] pulse-active"></div>
<span className="font-data-mono text-data-mono text-[#fbbf24]">12</span>
<span className="font-body-md text-[13px] text-slate">Units</span>
</div>
</td>
<td className="px-6 py-4 whitespace-nowrap text-right">
<span className="font-data-mono text-data-mono text-on-surface">$145.50</span>
</td>
<td className="px-6 py-4 whitespace-nowrap text-center">
<button className="text-slate hover:text-primary transition-colors p-1">
<MoreVertical className="w-5 h-5"  />
</button>
</td>
</tr>
{/* Row 3: Out of Stock */}
<tr className="hover:bg-graphite-2 transition-colors interactive-glow group opacity-60">
<td className="px-6 py-4 whitespace-nowrap">
<span className="font-data-mono text-data-mono text-on-surface-variant">KC-PWR-105</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center space-x-3">
<div className="w-10 h-10 rounded bg-graphite-2 border border-border-line p-1 relative overflow-hidden flex-shrink-0">
<img alt="High-Density Battery Pack" className="w-full h-full object-contain relative z-10 grayscale" data-alt="A clean, industrial design product photo of a dark grey, rectangular power supply unit with heat sink fins and robust connectors. The background is pure black, highlighting the matte texture of the metal." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUYb8-etaa40GwGirfE9Ojg9DIn8tmTZxYpBPtGvGE-LTre4m_ec5tXs6SbGt9DSPxR7-Y7hSexxcoCJV0CMqk6nKgyzkRPJCZ_Wao8V7pL7CNl9avOLkuFbAdtfJGV22xsb07CGXXoQKUmRFuniwc-p1N3QZpeV1XfMFQaSqQ0CS0UM0xnu90YQjsLnAo6ClkBcJkchvsYGNZM8V-S7aNPfSEdZVLfKUHTAMT6N2AhF11WIEGVKJ2tA"/>
</div>
<div>
<div className="font-label-ui text-label-ui text-on-surface">High-Density Battery Pack</div>
<div className="font-body-md text-[13px] text-slate mt-0.5">10,000mAh structural cell</div>
</div>
</div>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className="inline-flex items-center px-2 py-1 rounded-md bg-surface-variant text-on-surface-variant font-label-ui text-[12px]">Power Units</span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center space-x-2">
<div className="w-2 h-2 rounded-full bg-error"></div>
<span className="font-data-mono text-data-mono text-error">0</span>
<span className="font-body-md text-[13px] text-slate">Units</span>
</div>
</td>
<td className="px-6 py-4 whitespace-nowrap text-right">
<span className="font-data-mono text-data-mono text-on-surface">$89.99</span>
</td>
<td className="px-6 py-4 whitespace-nowrap text-center">
<button className="text-slate hover:text-primary transition-colors p-1">
<MoreVertical className="w-5 h-5"  />
</button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Pagination Footer */}
<div className="border-t border-border-line bg-graphite-1 px-6 py-4 flex items-center justify-between">
<div className="font-body-md text-body-md text-slate">
                        Showing <span className="text-on-surface font-label-ui">1</span> to <span className="text-on-surface font-label-ui">3</span> of <span className="text-on-surface font-label-ui">142</span> products
                    </div>
<div className="flex items-center space-x-2">
<button className="w-8 h-8 rounded border border-border-line flex items-center justify-center text-slate hover:text-on-surface hover:bg-graphite-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
<ChevronLeft className="w-[18px] h-[18px]"  />
</button>
<button className="w-8 h-8 rounded border border-primary bg-primary-container text-on-primary-container flex items-center justify-center font-label-ui text-label-ui">
                            1
                        </button>
<button className="w-8 h-8 rounded border border-border-line flex items-center justify-center text-slate hover:text-on-surface hover:bg-graphite-2 font-label-ui text-label-ui">
                            2
                        </button>
<button className="w-8 h-8 rounded border border-border-line flex items-center justify-center text-slate hover:text-on-surface hover:bg-graphite-2 font-label-ui text-label-ui">
                            3
                        </button>
<span className="text-slate">...</span>
<button className="w-8 h-8 rounded border border-border-line flex items-center justify-center text-slate hover:text-on-surface hover:bg-graphite-2">
<ChevronRight className="w-[18px] h-[18px]"  />
</button>
</div>
</div>
</div>
</div>
</main>

    </div>
  );
}
