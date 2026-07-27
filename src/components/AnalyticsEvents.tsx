"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
declare global {interface Window {fbq?: (...args: unknown[])=>void;ttq?:{track:(event:string)=>void};gtag?:(...args:unknown[])=>void}}
const track=(event:string)=>{window.fbq?.("track",event);window.ttq?.track(event==="Purchase"?"CompletePayment":event);window.gtag?.("event",event.toLowerCase())};
export function AnalyticsEvents(){const path=usePathname();useEffect(()=>{track("PageView");if(path==="/checkout")track("InitiateCheckout")},[path]);useEffect(()=>{const handler=(event:MouseEvent)=>{const el=(event.target as Element).closest("a,button");if(el instanceof HTMLAnchorElement&&el.href.includes("/checkout?package="))track("ViewContent");if(path==="/checkout"&&el instanceof HTMLButtonElement&&el.type==="submit")track("AddPaymentInfo")};document.addEventListener("click",handler);return()=>document.removeEventListener("click",handler)},[path]);return null}
export function PurchaseEvent(){useEffect(()=>{track("Purchase")},[]);return null}
