'use client';
import React from 'react';
import {DropdownMenu} from 'radix-ui';
import {Check,ChevronDown} from 'lucide-react';
const options=[['date','Tenggat terdekat'],['priority','Prioritas'],['title','Nama tugas']];
export function SortMenu({value,onChange}:{value:string;onChange:(value:string)=>void}){return <DropdownMenu.Root><DropdownMenu.Trigger className="sort-trigger" aria-label={'Urutkan tugas: '+options.find(o=>o[0]===value)?.[1]}><span>{options.find(o=>o[0]===value)?.[1]}</span><ChevronDown size={15}/></DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content className="sort-menu" align="end" sideOffset={8} collisionPadding={12}><DropdownMenu.RadioGroup value={value} onValueChange={onChange}>{options.map(([key,label])=><DropdownMenu.RadioItem className="sort-option" value={key} key={key}><span className="sort-indicator"><DropdownMenu.ItemIndicator><Check size={15}/></DropdownMenu.ItemIndicator></span>{label}</DropdownMenu.RadioItem>)}</DropdownMenu.RadioGroup></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root>}
