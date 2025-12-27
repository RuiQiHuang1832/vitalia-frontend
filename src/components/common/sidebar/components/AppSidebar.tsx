'use client'

import { Calendar, ClipboardList, Clock, HeartPulse, Users } from 'lucide-react'
import * as React from 'react'

import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { NavDashboard } from '@/components/common/sidebar/components/NavDashboard'
import { NavGroup } from '@/components/common/sidebar/components/NavGroup'
import { NavHeader } from '@/components/common/sidebar/components/NavHeader'
import { NavList } from '@/components/common/sidebar/components/NavList'
import { NavUser } from '@/components/common/sidebar/components/NavUser'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const providerNavigation = {
  navGroup: [
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
  ],
  navList: [
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
  variant: 'Provider',
  groupName: 'Clinical',
  listName: 'Administration',
}
const patientNavigation = {
  navGroup: [
    {
      title: 'Health Records',
      url: '#',
      icon: HeartPulse,
      items: [
        {
          title: 'Visit Notes',
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
  navList: [
    {
      name: 'Appointments',
      url: '#',
      icon: Calendar,
    },
  ],
  variant: 'Patient',
  groupName: 'My Health',
  listName: 'My Account',
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()
  const role = user?.role
  const navigation = role === 'PATIENT' ? patientNavigation : providerNavigation

  const person = {
    name: user?.displayName || 'User',
    email: user?.email || 'user@example.com',
    avatar: '/avatars/shadcn.jpg',
  }
  console.log(user)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader name={navigation.variant}></NavHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavDashboard />
        {navigation.navGroup?.length > 0 && (
          <NavGroup groupName={navigation.groupName} items={navigation.navGroup} />
        )}
        {navigation.navList?.length > 0 && (
          <NavList listName={navigation.listName} items={navigation.navList} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={person} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
