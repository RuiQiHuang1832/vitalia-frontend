'use client'

import { Calendar, ClipboardList, Clock, FileText, Users } from 'lucide-react'
import * as React from 'react'

import { NavHeader } from '@/components/common/sidebar/components/NavHeader'
import { NavMain } from '@/components/common/sidebar/components/NavMain'
import { NavProjects } from '@/components/common/sidebar/components/NavProjects'
import { NavUser } from '@/components/common/sidebar/components/NavUser'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: 'Admin ',
    email: 'admin@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Patients',
      url: '#',
      icon: Users,
      isActive: true,
      items: [
        {
          title: 'Patient List',
          url: '#',
        },
      ],
    },
    {
      title: 'Appointments',
      url: '#',
      icon: Calendar,
      items: [
        {
          title: 'Upcoming',
          url: '#',
        },
        {
          title: 'Past',
          url: '#',
        },
        {
          title: 'Calendar View',
          url: '#',
        },
      ],
    },
    {
      title: 'EMR',
      url: '#',
      icon: FileText,
      items: [
        {
          title: 'Visit Notes',
          url: '#',
        },
        {
          title: 'Problems',
          url: '#',
        },
        {
          title: 'Medications',
          url: '#',
        },
        {
          title: 'Allergies',
          url: '#',
        },
        {
          title: 'Vitals',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Audit Logs',
      url: '#',
      icon: ClipboardList,
    },
    {
      name: 'Availability',
      url: '#',
      icon: Clock,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader></NavHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
