import {
  AlignLeft,
  Bell,
  Briefcase,
  Calendar,
  Circle,
  CreditCard,
  DollarSign,
  FilePlus,
  FileText,
  Headphones,
  Home,
  List,
  Mail,
  MapPin,
  MessageSquare,
  Settings,
  Tv,
  User,
  UserPlus,
  Users,
} from "react-feather";
import { env } from "~/env.mjs";
export const partnerMenuData = [
  {
    id: "home",
    title: "Dashboard",
    icon: <Home size={20} />,
    navLink: "/dashboard",
  },
  {
    id: "my-account",
    title: "My Account",
    icon: <CreditCard size={20} />,
    navLink: "/my-account",
  },
  {
    id: "partner-employee",
    title: "My Employees",
    icon: <User size={20} />,
    navLink: "/partner-employee",
  },
  {
    id: "media",
    title: "Media",
    icon: <Tv size={20} />,
    navLink: "/media",
  },
  {
    id: "message",
    title: "Message",
    icon: <MessageSquare size={20} />,
    navLink: "/message",
  },
  {
    id: "notification",
    title: "Notification",
    icon: <Bell size={20} />,
    navLink: "/notification",
  },
  {
    id: "event-management",
    title: "Event Management",
    icon: <Calendar size={20} />,
    navLink: "/event-management",
  },
  {
    id: "support-request",
    title: "Support Request",
    icon: <Headphones size={20} />,
    navLink: "/support-request-listing",
  },
  {
    id: "availability-check",
    title: "Availability Check",
    icon: <Settings size={20} />,
    navLink: "/availability-check",
  },
];

export const partnerUserMenuData = [
  {
    id: "home",
    title: "Dashboard",
    icon: <Home size={20} />,
    navLink: "/dashboard",
  },
  {
    id: "my-account",
    title: "My Account",
    icon: <CreditCard size={20} />,
    navLink: "/my-account",
  },
  {
    id: "media",
    title: "Media",
    icon: <Tv size={20} />,
    navLink: "/media",
  },
  {
    id: "event-management",
    title: "Event Management",
    icon: <Calendar size={20} />,
    navLink: "/event-management",
  },
];

export const customerMenuData = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home size={20} />,
    navLink: "/dashboard",
  },
  {
    id: "my-account",
    title: "My Account",
    icon: <Mail size={20} />,
    navLink: "/my-account",
  },
  {
    id: "message",
    title: "Message",
    icon: <MessageSquare size={20} />,
    navLink: "/message",
  },
  {
    id: "myevents",
    title: "My Events",
    icon: <Calendar size={20} />,
    navLink: "/event-management",
    children: [
      {
        id: "upcomingevent",
        title: "Upcoming Event ",
        icon: <Circle size={12} />,
        navLink: "/event-management/upcoming-event",
      },
      {
        id: "eventhistory",
        title: "Event History",
        icon: <Circle size={12} />,
        navLink: "/event-management/event-history",
      },
    ],
  },
  {
    id: "supportrequest",
    title: "Support Request",
    icon: <Headphones size={20} />,
    navLink: "/support-request-listing",
  },
];

export const adminMenuData = [
  {
    id: "event",
    navLink: "/event",
    title: "Event Management",
    icon: <Calendar size={20} />,
  },
  {
    id: "customer",
    navLink: "/customer",
    title: "Customer Management",
    icon: <User size={20} />,
  },
  {
    id: "partner",
    navLink: "/partner",
    title: "Partner Management",
    icon: <Users size={20} />,
  },
  {
    id: "media",
    navLink: "/media",
    title: "Media",
    icon: <Tv size={20} />,
  },
  {
    id: "role",
    navLink: "/role",
    title: "Role",
    icon: <Briefcase size={20} />,
  },
  {
    id: "venue",
    navLink: "/venue",
    title: "Venue",
    icon: <MapPin size={20} />,
  },
  {
    id: "hipstr-member",
    navLink: "/hipstr-member",
    title: "Hipstr Member",
    icon: <UserPlus size={20} />,
  },
  {
    id: "notification-partner",
    navLink: "/notification-partner",
    title: "Partner Notification",
    icon: <Bell size={20} />,
  },
  {
    id: "support-request",
    navLink: "/support-request",
    title: "Support Request",
    icon: <Headphones size={20} />,
    children: [
      {
        id: "client-support-request",
        navLink: "/client-support-request",
        title: "Client Support Request",
        icon: <Circle size={20} />,
      },
      {
        id: "partner-support-request",
        navLink: "/partner-support-request",
        title: "Partner Support Request",
        icon: <Circle size={20} />,
      },
    ],
  },
  {
    id: "message",
    navLink: "/message",
    title: "Message",
    icon: <MessageSquare size={20} />,
  },
  {
    id: "blog",
    navLink: "/blog",
    title: "Blog",
    icon: <AlignLeft size={20} />,
  },
  {
    id: "availability-check",
    navLink: "/availability-check",
    title: "Availability Check",
    icon: <Settings size={20} />,
  },
  {
    id: "promotional-codes",
    navLink: "/promotional-codes",
    title: "Promotional Codes",
    icon: <DollarSign size={20} />,
  },
  // {
  //   id: "invoice-for-corporate",
  //   title: "Invoice for Corporate",
  //   icon: <FileText size={20} />,
  //   navLink: "/invoice-for-corporate",
  // },
  {
    id: "invoices",
    title: "Invoice",
    icon: <FileText size={20} />,
    children: [
      {
        id: "new-invoice",
        title: "New Invoice",
        icon: <FilePlus size={20} />,
        navLink: "/invoices/new-invoice-selection",
      },
      {
        id: "invoices",
        title: "Invoices",
        icon: <List size={20} />,
        navLink: "/invoices/invoice-history",
      },
    ],
  },
  // TODO: Remove this line after it's ready for production
].filter((item) => env.NEXT_PUBLIC_INVOICES_ENABLED === "true" || item.id !== "invoices");
