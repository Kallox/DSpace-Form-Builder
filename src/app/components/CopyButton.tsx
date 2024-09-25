'use client'

import React, {useState} from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
    <button className="absolute top-2 right-5 bg-white p-1 rounded-lg">
      <CopyToClipboard text={code} onCopy={handleCopy}>
        <div>
            { copied ?
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-check" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M5 12l5 5l10 -10" />
            </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-copy" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
            </svg>
            }
        </div>
      </CopyToClipboard>
    </button>
  );
}
