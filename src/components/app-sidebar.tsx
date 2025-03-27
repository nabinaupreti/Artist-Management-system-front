// import type * as React from "react"

// import { User, Mic2, Music } from "lucide-react"
// import { SearchForm } from "@/components/search-form"
// import { VersionSwitcher } from "@/components/version-switcher"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarRail,
// } from "@/components/ui/sidebar"

// // This is sample data.
// const data = {
//   versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
//   navMain: [
//     {
//       title: "Discover",
//       url: "#",
//       items: [
//         {
//           title: "User",
//           url: "/user",
//           icon: User,
//         },
//         {
//           title: "Artist",
//           url: "/artist",
//           icon: Mic2,
//         },
//         {
//           title: "Music",
//           url: "/music",
//           icon: Music,
//         },
       
//       ],
//     },
//   ],
// }

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar {...props}>
//       <SidebarHeader>
//         <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
//         <SearchForm />
//       </SidebarHeader>
//       <SidebarContent>
//         {/* We create a SidebarGroup for each parent. */}
//         {data.navMain.map((item) => (
//           <SidebarGroup key={item.title}>
//             <SidebarGroupLabel>
//               <div className="flex items-center gap-2">
//                 {item.icon && <item.icon className="h-4 w-4" />}
//                 <span>{item.title}</span>
//               </div>
//             </SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {item.items.map((subItem) => (
//                   <SidebarMenuItem key={subItem.title}>
//                     <SidebarMenuButton asChild isActive={subItem.isActive}>
//                       <a href={subItem.url}>
//                         {subItem.icon && <subItem.icon className="h-4 w-4" />}
//                         <span>{subItem.title}</span>
//                       </a>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         ))}
//       </SidebarContent>
//       <SidebarRail />
//     </Sidebar>
//   )
// }



"use client";
import * as React from "react";
import { Music, MicVocal, Home, LibraryBig, ListMusic, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Sidebar navigation based on roles
const sidebarItems: Record<string, { title: string; url: string; icon: React.ElementType }[]> = {
  super_admin: [
    { title: "Home", url: "/dashboard", icon: Home },
    { title: "Music", url: "/music", icon: Music },
    { title: "Artists", url: "/artist", icon: MicVocal },
    { title: "Users", url: "/user", icon: UsersRound },
  ],
  artist_manager: [
    { title: "Home", url: "/dashboard", icon: Home },
    { title: "Music", url: "/songlist", icon: Music },
    { title: "Artists", url: "/artist", icon: MicVocal },
   
  ],
  artist: [
    { title: "Home", url: "/dashboard", icon: Home },
    { title: "My Music", url: "/my-music", icon: Music },
    
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role_type || "artist"); // Default to "artist"
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const menuItems = sidebarItems[userRole || "artist"]; // Ensure valid role

  return (
    <Sidebar {...props}>
      <SidebarHeader>Artist Management System</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon size={18} className="mr-2" />
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}