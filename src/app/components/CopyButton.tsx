'use client'

import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy, Check } from "lucide-react";

type Props = {
  code: string;
};

export function CopyButton({ code }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="absolute top-2.5 right-3 z-10">
      <CopyToClipboard text={code} onCopy={handleCopy}>
        <button 
          className={`p-1.5 rounded-lg border transition-all duration-200 flex items-center justify-center ${
            copied 
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' 
              : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-750 hover:text-white'
          }`}
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check className="h-4 w-4 stroke-[2.5]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </CopyToClipboard>
    </div>
  );
}
