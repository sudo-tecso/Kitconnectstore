import React from 'react';
import {
  LayoutDashboard,
  Package,
  Receipt,
  History,
  Cpu,
  Plus,
  LogOut,
  Bell,
  HelpCircle,
  Filter,
  Search,
  Check,
  Download,
  Send,
  CircuitBoard,
  CreditCard,
  Truck
} from 'lucide-react';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-[#121315] text-[#e3e2e5] font-['Hanken_Grotesk'] h-screen flex overflow-hidden dark">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#16181C] border-r border-[#26292F] flex flex-col p-3 space-y-2 z-20">
        <div className="flex items-center gap-3 px-3 py-4 border-b border-[#26292F] mb-4">
          <div className="w-10 h-10 rounded-full bg-[#1D2025] border border-[#26292F] flex items-center justify-center shrink-0">
            <img 
              className="w-full h-full rounded-full object-cover" 
              alt="System administrator avatar" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYdMqwTnf1LhoFYQOXUyNoCuWLz2dhgy5Tk0Nc60qB2-Kxko-lWMiCBtzP_J9oKD3uRTvbb6A_riBNTxaOueWoZoeuTMB3Y5JtV3UL3S-utNjTykNQx852OhDluHkNboXu-H5Wa--ChoE_ubszDUD1Jf2X2lMIq5470S8WVi_BN1qzsEibbKDBoK4CKXLNJO8AU_7HSGY5EgOTNmvXKcrdaBqJavjjmwhvheeSq_ylXZURjyRObVxhgQ"
            />
          </div>
          <div>
            <h1 className="font-['Hanken_Grotesk'] text-[19px] font-bold leading-[1.3] text-[#e3e2e5]">Precision Admin</h1>
            <p className="font-['JetBrains_Mono'] text-[10px] tracking-[1px] text-[#8A8F98]">Hardware Node: 01</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-3 py-2 text-[13px] font-semibold text-[#c3c6d8] hover:bg-[#343537] hover:text-[#e3e2e5] rounded-lg transition-all duration-150 ease-in-out" href="#">
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-[13px] font-semibold text-[#c3c6d8] hover:bg-[#343537] hover:text-[#e3e2e5] rounded-lg transition-all duration-150 ease-in-out" href="#">
            <Package size={20} />
            Product Catalog
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-[13px] font-semibold bg-[#0464c3] text-[#d9e4ff] rounded-lg transition-all duration-150 ease-in-out relative overflow-hidden group" href="#">
            <div className="absolute inset-0 bg-[rgba(47,111,255,0.08)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Receipt size={20} />
            Order Queue
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-[13px] font-semibold text-[#c3c6d8] hover:bg-[#343537] hover:text-[#e3e2e5] rounded-lg transition-all duration-150 ease-in-out" href="#">
            <History size={20} />
            Inventory Log
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-[13px] font-semibold text-[#c3c6d8] hover:bg-[#343537] hover:text-[#e3e2e5] rounded-lg transition-all duration-150 ease-in-out" href="#">
            <Cpu size={20} />
            System Health
          </a>
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <button className="w-full py-2 px-4 bg-transparent border border-[#26292F] text-[#e3e2e5] text-[13px] font-semibold rounded-lg hover:bg-[#343537] transition-colors flex items-center justify-center gap-2">
            <Plus size={18} />
            New Requisition
          </button>
          <div className="border-t border-[#26292F] pt-2">
            <a className="flex items-center gap-3 px-3 py-2 text-[13px] font-semibold text-[#c3c6d8] hover:bg-[#343537] hover:text-[#e3e2e5] rounded-lg transition-all duration-150 ease-in-out" href="#">
              <LogOut size={20} />
              Logout
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-64 flex-1 flex flex-col h-full relative z-10">
        <header className="w-full h-16 bg-[#16181C] border-b border-[#26292F] shrink-0 flex justify-between items-center px-8 mx-auto max-w-[1400px] sticky top-0 z-30">
          <div className="flex items-center gap-8 h-full">
            <span className="font-['Hanken_Grotesk'] text-[19px] font-bold text-[#b4c5ff] tracking-tighter">PRECISION ENGINE</span>
            <nav className="hidden md:flex h-full items-end gap-6 pb-1">
              <a className="text-[14px] text-[#c3c6d8] hover:text-[#b4c5ff] transition-colors duration-200 cursor-pointer active:opacity-80" href="#">Analytics</a>
              <a className="text-[14px] text-[#c3c6d8] hover:text-[#b4c5ff] transition-colors duration-200 cursor-pointer active:opacity-80" href="#">Inventory</a>
              <a className="text-[14px] text-[#b4c5ff] border-b-2 border-[#b4c5ff] pb-1 hover:text-[#b4c5ff] transition-colors duration-200 cursor-pointer active:opacity-80 relative" href="#">
                Orders
                <div className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-[#b4c5ff] shadow-[0_0_8px_rgba(47,111,255,0.4)]"></div>
              </a>
              <a className="text-[14px] text-[#c3c6d8] hover:text-[#b4c5ff] transition-colors duration-200 cursor-pointer active:opacity-80" href="#">Settings</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#c3c6d8] hover:text-[#b4c5ff] transition-colors cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#343537]">
              <Bell size={24} />
            </button>
            <button className="text-[#c3c6d8] hover:text-[#b4c5ff] transition-colors cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#343537]">
              <HelpCircle size={24} />
            </button>
            <img 
              className="w-8 h-8 rounded-full border border-[#26292F] object-cover ml-2" 
              alt="Administrator avatar" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgL8a5DPE1ZwQPoBQngcCn2qjejVo3hUqwbf6YHjXjTSf2TDhP94PG_IJ_ec6lofWj_lbHKMOcep_CzqqZNZO3Alvc8tGgKRcknNNjqgm125VbheE-6aIx1Ir-RG4_mUvlw0Xg4Fwr26SI-TcDJluD_MMozGgT0ECBjvv0o8oDRrT8xIEqHF5kdXwVXN6mXe6OJ36D5xBwdPcqU88NuqT2r9CB9kaLWl0A-wsyxM2HfFveUQSNGeHeUw"
            />
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden p-3 gap-3 max-w-[1400px] mx-auto w-full">
          {/* Master View */}
          <section className="w-[380px] shrink-0 flex flex-col bg-[#16181C] border border-[#26292F] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#26292F] bg-[#1D2025] flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-[19px] font-bold text-[#e3e2e5]">Order Queue</h2>
                <p className="font-['JetBrains_Mono'] text-[10px] tracking-[1px] text-[#8A8F98] mt-1">73 ACTIVE REQUISITIONS</p>
              </div>
              <button className="w-8 h-8 rounded border border-[#26292F] flex items-center justify-center text-[#c3c6d8] hover:text-[#e3e2e5] hover:bg-[#343537] transition-colors">
                <Filter size={18} />
              </button>
            </div>
            <div className="p-3 border-b border-[#26292F] bg-[#16181C] shrink-0">
              <div className="relative bg-[#1D2025] rounded border border-[#26292F] flex items-center px-3 py-1.5 focus-within:border-[#b4c5ff] focus-within:ring-1 focus-within:ring-[#b4c5ff] transition-all">
                <Search className="text-[#8A8F98] w-[18px] h-[18px] mr-2" />
                <input 
                  className="bg-transparent border-none p-0 m-0 w-full font-['JetBrains_Mono'] text-[13px] text-[#e3e2e5] placeholder:text-[#8A8F98] focus:ring-0 outline-none" 
                  placeholder="Search ID or Client..." 
                  type="text"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-4 border-b border-[#26292F] bg-[#1D2025] relative cursor-pointer group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#b4c5ff] shadow-[0_0_8px_rgba(47,111,255,0.4)]"></div>
                <div className="absolute inset-0 bg-[rgba(47,111,255,0.04)] pointer-events-none"></div>
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className="font-['JetBrains_Mono'] text-[13px] text-[#b4c5ff] font-bold">REQ-7782</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#0464c3]/20 border border-[#0464c3]/30 text-[#a9c7ff] font-['JetBrains_Mono'] text-[10px] flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#a9c7ff] animate-pulse"></div> Processing
                  </span>
                </div>
                <div className="flex justify-between items-end relative z-10">
                  <div>
                    <p className="text-[13px] font-semibold text-[#e3e2e5]">Nexus Logistics Hub</p>
                    <p className="text-[12px] font-semibold text-[#8A8F98]">12 Items • Express</p>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-[13px] text-[#e3e2e5]">$14,250.00</span>
                </div>
              </div>

              <div className="p-4 border-b border-[#26292F] bg-[#16181C] hover:bg-[#1D2025] cursor-pointer transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-['JetBrains_Mono'] text-[13px] text-[#e3e2e5] group-hover:text-[#b4c5ff] transition-colors">REQ-7781</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#343537] border border-[#424655] text-[#8A8F98] font-['JetBrains_Mono'] text-[10px]">Pending Setup</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[13px] font-semibold text-[#e3e2e5]">Aero Dynamics Inc.</p>
                    <p className="text-[12px] font-semibold text-[#8A8F98]">3 Items • Standard</p>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-[13px] text-[#8A8F98]">$3,400.00</span>
                </div>
              </div>

              <div className="p-4 border-b border-[#26292F] bg-[#16181C] hover:bg-[#1D2025] cursor-pointer transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-['JetBrains_Mono'] text-[13px] text-[#e3e2e5] group-hover:text-[#b4c5ff] transition-colors">REQ-7780</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#343537] border border-[#424655] text-[#8A8F98] font-['JetBrains_Mono'] text-[10px]">Pending Setup</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[13px] font-semibold text-[#e3e2e5]">Stark Industries Sector 4</p>
                    <p className="text-[12px] font-semibold text-[#8A8F98]">45 Items • Freight</p>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-[13px] text-[#8A8F98]">$89,100.00</span>
                </div>
              </div>

              <div className="p-4 border-b border-[#26292F] bg-[#16181C] hover:bg-[#1D2025] cursor-pointer transition-colors group opacity-75">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-['JetBrains_Mono'] text-[13px] text-[#8A8F98] group-hover:text-[#b4c5ff] transition-colors">REQ-7779</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#1D2025] border border-[#26292F] text-[#8A8F98] font-['JetBrains_Mono'] text-[10px] flex items-center gap-1">
                    <Check size={12} /> Cleared
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[13px] font-semibold text-[#8A8F98]">Cyberdyne Systems</p>
                    <p className="text-[12px] font-semibold text-[#5B5F66]">1 Item • Express</p>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-[13px] text-[#5B5F66]">$1,200.00</span>
                </div>
              </div>
            </div>
          </section>

          {/* Detail View */}
          <section className="flex-1 bg-[#16181C] border border-[#26292F] rounded-lg overflow-hidden flex flex-col relative">
            <div className="p-6 pb-4 bg-[#1D2025] border-b border-[#26292F] shrink-0 z-10 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#b4c5ff]/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-[28px] font-bold text-[#e3e2e5] tracking-tight">Requisition <span className="text-[#b4c5ff] font-['JetBrains_Mono']">7782</span></h2>
                    <span className="px-2.5 py-1 rounded-full bg-[#0464c3]/20 border border-[#0464c3]/30 text-[#a9c7ff] text-[13px] font-semibold flex items-center gap-1.5 backdrop-blur-sm">
                      <div className="w-2 h-2 rounded-full bg-[#a9c7ff] shadow-[0_0_6px_rgba(169,199,255,0.8)] animate-pulse"></div> Processing
                    </span>
                  </div>
                  <p className="text-[14px] text-[#8A8F98]">Client: Nexus Logistics Hub • Placed: Oct 24, 2023 14:32 UTC</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-lg border border-[#26292F] bg-[#16181C] hover:bg-[#1D2025] text-[#e3e2e5] text-[13px] font-semibold transition-colors flex items-center gap-2 group">
                    <Download className="w-[18px] h-[18px] text-[#8A8F98] group-hover:text-[#e3e2e5] transition-colors" />
                    Manifest
                  </button>
                  <button className="px-6 py-2 rounded-lg bg-[#0464c3] text-[#d9e4ff] text-[13px] font-semibold hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(4,100,195,0.3)] flex items-center gap-2">
                    <Send className="w-[18px] h-[18px]" />
                    Dispatch Units
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-14 relative custom-scrollbar">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-['JetBrains_Mono'] text-[11px] tracking-[3px] text-[#8A8F98] uppercase">Hardware Manifest</h3>
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-[#b4c5ff] to-transparent shadow-[0_0_8px_rgba(180,197,255,0.2)]"></div>
                </div>
                <div className="bg-[#1D2025] border border-[#26292F] rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#26292F] bg-[#16181C]/50">
                        <th className="py-2.5 px-4 font-['JetBrains_Mono'] text-[10px] text-[#8A8F98] font-normal">SKU</th>
                        <th className="py-2.5 px-4 font-['JetBrains_Mono'] text-[10px] text-[#8A8F98] font-normal">COMPONENT</th>
                        <th className="py-2.5 px-4 font-['JetBrains_Mono'] text-[10px] text-[#8A8F98] font-normal text-right">QTY</th>
                        <th className="py-2.5 px-4 font-['JetBrains_Mono'] text-[10px] text-[#8A8F98] font-normal text-right">UNIT PRICE</th>
                        <th className="py-2.5 px-4 font-['JetBrains_Mono'] text-[10px] text-[#8A8F98] font-normal text-right">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="font-['JetBrains_Mono'] text-[13px] text-[#e3e2e5] divide-y divide-[#26292F]">
                      <tr className="hover:bg-[#343537]/30 transition-colors">
                        <td className="py-3 px-4 text-[#8A8F98]">NX-CORE-V9</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#121315] border border-[#26292F] flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#b4c5ff]/20 to-transparent"></div>
                              <Cpu className="text-[#b4c5ff] w-[18px] h-[18px]" />
                            </div>
                            <span className="font-['Hanken_Grotesk'] text-[14px]">Neural Processing Unit V9</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">04</td>
                        <td className="py-3 px-4 text-right text-[#8A8F98]">$2,500.00</td>
                        <td className="py-3 px-4 text-right font-bold">$10,000.00</td>
                      </tr>
                      <tr className="hover:bg-[#343537]/30 transition-colors">
                        <td className="py-3 px-4 text-[#8A8F98]">MEM-LDR-64</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#121315] border border-[#26292F] flex items-center justify-center relative overflow-hidden">
                              <CircuitBoard className="text-[#8A8F98] w-[18px] h-[18px]" />
                            </div>
                            <span className="font-['Hanken_Grotesk'] text-[14px]">High-Density Logic Array</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">08</td>
                        <td className="py-3 px-4 text-right text-[#8A8F98]">$450.00</td>
                        <td className="py-3 px-4 text-right font-bold">$3,600.00</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-4 bg-[#16181C] border-t border-[#26292F] flex justify-end items-center gap-6">
                    <div className="text-right">
                      <p className="font-['JetBrains_Mono'] text-[10px] text-[#8A8F98] mb-1">SUBTOTAL</p>
                      <p className="font-['JetBrains_Mono'] text-[13px] text-[#e3e2e5]">$13,600.00</p>
                    </div>
                    <div className="text-right">
                      <p className="font-['JetBrains_Mono'] text-[10px] text-[#8A8F98] mb-1">TAX / FEES</p>
                      <p className="font-['JetBrains_Mono'] text-[13px] text-[#e3e2e5]">$650.00</p>
                    </div>
                    <div className="text-right border-l border-[#26292F] pl-6">
                      <p className="font-['JetBrains_Mono'] text-[10px] text-[#b4c5ff] mb-1">NET TOTAL</p>
                      <p className="text-[19px] font-bold text-[#e3e2e5]">$14,250.00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-7">
                <div className="bg-[#1D2025] border border-[#26292F] rounded-lg p-5 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-['JetBrains_Mono'] text-[11px] tracking-[3px] text-[#8A8F98] uppercase">Settlement Data</h3>
                    <span className="px-2 py-0.5 rounded bg-[#343537] border border-[#26292F] text-[#e3e2e5] text-[10px] font-['JetBrains_Mono'] uppercase">Authorized</span>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center border-b border-[#26292F] pb-2">
                      <span className="text-[14px] text-[#8A8F98]">Transaction ID</span>
                      <span className="font-['JetBrains_Mono'] text-[13px] text-[#e3e2e5]">TXN-998-ALPHA</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#26292F] pb-2">
                      <span className="text-[14px] text-[#8A8F98]">Method</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-4 bg-[#343537] rounded flex items-center justify-center border border-[#26292F]">
                          <CreditCard className="w-3 h-3 text-[#8A8F98]" />
                        </div>
                        <span className="font-['JetBrains_Mono'] text-[13px] text-[#e3e2e5]">•••• 4432</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#26292F] pb-2">
                      <span className="text-[14px] text-[#8A8F98]">Ledger Entry</span>
                      <span className="font-['JetBrains_Mono'] text-[13px] text-[#e3e2e5]">Oct 24, 14:35 UTC</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1D2025] border border-[#26292F] rounded-lg p-5 flex flex-col relative overflow-hidden group">
                  <div 
                    className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen grayscale group-hover:opacity-30 transition-opacity bg-cover bg-center" 
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjZk8LLWI-_N6Hv5I3oh1PpalIKjWARtnPNSkzi9JnHcIveWXf-sEyjnU9Iuwe_9F9VHujpc6GHZ9VX1uWb1gJPwYbnkS39pTi83h1accE4EjyAfHHpzGyAZSf_96YkPxKBjL5dtsOryLc3mEkDh_Uo3A289VFJaMDpNI6Y0oS6ATFTvgHP1f2utZVI7wbUAwstpsjFkA8h7IWto4tS4bEhVDYIxaqcao7_6dUeow4ko9uvTNA2qaKNQ')" }}
                  ></div>
                  <div className="relative z-10 flex justify-between items-start mb-4">
                    <h3 className="font-['JetBrains_Mono'] text-[11px] tracking-[3px] text-[#8A8F98] uppercase">Logistics Routing</h3>
                    <Truck className="w-6 h-6 text-[#8A8F98]" />
                  </div>
                  <div className="relative z-10 flex-1 flex flex-col justify-end space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 flex flex-col items-center mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#8A8F98] border border-[#121315] z-10"></div>
                        <div className="w-0.5 h-6 bg-[#26292F] my-1"></div>
                      </div>
                      <div>
                        <p className="font-['JetBrains_Mono'] text-[10px] text-[#8A8F98] mb-0.5">ORIGIN NODE</p>
                        <p className="font-['JetBrains_Mono'] text-[13px] text-[#e3e2e5]">Facility 01 - Western Seaboard</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 flex flex-col items-center mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#b4c5ff] shadow-[0_0_4px_rgba(180,197,255,0.8)] border border-[#121315] z-10 relative">
                          <div className="absolute inset-0 rounded-full bg-[#b4c5ff] animate-ping opacity-75"></div>
                        </div>
                      </div>
                      <div>
                        <p className="font-['JetBrains_Mono'] text-[10px] text-[#b4c5ff] mb-0.5">DESTINATION</p>
                        <p className="font-['JetBrains_Mono'] text-[13px] text-[#e3e2e5]">Nexus Logistics Hub (Awaiting Dispatch)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: \`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #121315; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #343537; 
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5B5F66; 
        }
      \`}} />
    </div>
  );
}
