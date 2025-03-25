import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div> */}
                <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl">
              <img
                src="https://i.pinimg.com/236x/71/91/38/719138d4d39d44d6685580a88fcf767e.jpg"
                alt="Description of image"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <img
                src="https://i.pinimg.com/236x/25/20/cc/2520cc8e66f01ece9037cd6ed181def9.jpg"
                alt="Description of image"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <img
                src="https://i.pinimg.com/236x/37/8b/1f/378b1fb60073a39020874a3701f15f4d.jpg"
                alt="Description of image"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl" >
            <img
              src="https://i.pinimg.com/736x/87/1e/a4/871ea40341098ed99b2ab355ae210097.jpg"
              className="w-full h-full object-cover rounded-xl" />
            
              </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}
