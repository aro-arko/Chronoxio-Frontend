"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { CollapsibleContent } from "@/components/ui/collapsible";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../app/assets/images/clock.svg";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  children?: NavItem[];
};

type NavMainProps = {
  items?: NavItem[]; // optional, defaults to []
};

export function NavMain({ items = [] }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="mb-4">
        <div className="flex items-center gap-2" aria-label="Chronoxio">
          <Image
            src={logo}
            alt="Chronoxio Logo"
            width={36}
            height={36}
            className="rounded-md object-contain"
            priority
          />
          <span className="text-xl text-black md:text-2xl font-bold">
            Chronoxio
          </span>
        </div>
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) =>
          item.children?.length ? (
            <Collapsible key={item.title} asChild>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
