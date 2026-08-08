"use client";import Link from "next/link";import {usePathname} from "next/navigation";import {FiBox,FiTag,FiUsers} from "react-icons/fi";
const links=[{href:"/admin/orders",label:"Orders",icon:FiBox},{href:"/admin/affiliates",label:"Affiliates",icon:FiUsers},{href:"/admin/vouchers",label:"Vouchers",icon:FiTag}];
export function AdminNav(){const pathname=usePathname();return <nav className="admin-nav">{links.map(({href,label,icon:Icon})=><Link key={href} href={href} className={pathname.startsWith(href)?"current":""}><Icon/><span>{label}</span></Link>)}</nav>}
