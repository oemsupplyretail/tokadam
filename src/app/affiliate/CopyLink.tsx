"use client";
import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
export function CopyLink({link}:{link:string}){const [copied,setCopied]=useState(false);async function copy(){await navigator.clipboard.writeText(link);setCopied(true);setTimeout(()=>setCopied(false),1800)}return <div className="copy-link"><code>{link}</code><button type="button" onClick={copy}>{copied?<FiCheck/>:<FiCopy/>}{copied?"Disalin":"Salin link"}</button></div>}
