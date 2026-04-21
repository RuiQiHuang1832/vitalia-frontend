'use client'

import { Calendar, ClipboardList, Clock, FolderHeart, Users } from 'lucide-react'
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
          url: '/patients',
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
          url: '/appointments',
        },
      ],
    },
  ],
  navList: [
    {
      name: 'Audit Logs',
      url: '/audit-logs',
      icon: ClipboardList,
    },
    {
      name: 'Availability',
      url: '/availability',
      icon: Clock,
    },
  ],
  variant: 'Provider',
  groupName: 'Clinical',
  listName: 'Administration',
}
const patientNavigation = {
  navGroup: [],
  navList: [
    {
      name: 'Appointments',
      url: '/portal/appointments',
      icon: Calendar,
    },
    {
      name: 'Medical Records',
      url: '/portal/medical-records',
      icon: FolderHeart,
    },
  ],
  variant: 'Patient',
  groupName: '',
  listName: 'My Health',
}
const adminNavigation = {
  navGroup: [],
  navList: [
    {
      name: 'Users',
      url: '/admin/users',
      icon: Users,
    },
    {
      name: 'Audit Logs',
      url: '/admin/audit-logs',
      icon: ClipboardList,
    },
  ],
  variant: 'Admin',
  groupName: '',
  listName: 'Administration',
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()

  const role = user?.role

  const navigation =
    role === 'PATIENT' ? patientNavigation : role === 'ADMIN' ? adminNavigation : providerNavigation

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader name={navigation.variant}></NavHeader>
      </SidebarHeader>
      <SidebarContent>
        {role == "PROVIDER" && <NavDashboard />}
        {navigation.navGroup?.length > 0 && (
          <NavGroup groupName={navigation.groupName} items={navigation.navGroup} />
        )}
        {navigation.navList?.length > 0 && (
          <NavList listName={navigation.listName} items={navigation.navList} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
