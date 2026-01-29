'use client'

import {
  BarChart3,
  Calendar,
  ClipboardList,
  Clock,
  HeartPulse,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react'
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
const adminNavigation = {
  navGroup: [
    {
      title: 'User Management',
      url: '#',
      icon: Users,
      isActive: true,
      items: [
        {
          title: 'All Users',
          url: '/admin/users',
        },
        {
          title: 'Providers',
          url: '/admin/providers',
        },
        {
          title: 'Patients',
          url: '/admin/patients',
        },
      ],
    },
    {
      title: 'System Oversight',
      url: '#',
      icon: ShieldCheck,
      items: [
        {
          title: 'Audit Logs',
          url: '/admin/audit-logs',
        },
        {
          title: 'Login Activity',
          url: '/admin/sessions',
        },
      ],
    },
  ],

  navList: [
    {
      name: 'Appointments',
      url: '/admin/appointments',
      icon: Calendar,
    },
    {
      name: 'System Metrics',
      url: '/admin/metrics',
      icon: BarChart3,
    },
    {
      name: 'Settings',
      url: '/admin/settings',
      icon: Settings,
    },
  ],

  variant: 'Admin',
  groupName: 'Administration',
  listName: 'System',
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
        <NavDashboard />
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
