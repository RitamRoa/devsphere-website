"use client";
import { Github, Menu } from "lucide-react";
import devsphereLogo from "@/public/devsphereLogo.png";
import devgif from "@/public/dev.gif";
import React from "react";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ToggleTheme } from "./toogle-theme";

interface RouteProps {
    href: string;
    label: string;
}

interface FeatureProps {
    title: string;
    description: string;
    href: string;
}

const routeList: RouteProps[] = [
    {
        href: "#testimonials",
        label: "Testimonials",
    },
    {
        href: "https://lu.ma/devsphere",
        label: "Events",
    },
    {
        href: "/santhe",
        label: "Santhe",
    },
    {
        href: "#contact",
        label: "Contact",
    },
    {
        href: "#faq",
        label: "FAQ",
    },
];

const featureList: FeatureProps[] = [
    {
        title: "Team",
        description: "Get to know the team behind DevSphere",
        href: "#team",
    },
    {
        title: "Benefits",
        description: "Discover the advantages of joining our club.",
        href: "#benefits",
    },
    {
        title: "Features",
        description: "Explore the opportunities and activities we offer.",
        href: "#features",
    },
];

export const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-around items-stretch p-2 bg-card">
            <Link
                href="/"
                className="font-bold text-lg flex justify-center items-center"
            >
                <Image
                    src={devsphereLogo}
                    alt=""
                    width={30}
                    height={30}
                    className="pl-1"
                />
                <h3 className="text-xl pl-2">DevSphere</h3>
            </Link>
            {/* <!-- Mobile --> */}
            <div className="flex items-center lg:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Menu
                            onClick={() => setIsOpen(!isOpen)}
                            className="cursor-pointer lg:hidden"
                        />
                    </SheetTrigger>

                    <SheetContent
                        side="left"
                        className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
                    >
                        <div>
                            <SheetHeader className="mb-4 ml-4">
                                <SheetTitle className="flex items-center">
                                    <Link
                                        href="/"
                                        className="flex items-center"
                                    >
                                        {/* <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" /> */}
                                        <Image
                                            src={devsphereLogo}
                                            alt=""
                                            width={40}
                                            height={40}
                                            className="pl-1"
                                        />
                                        <div className="p-1"></div>
                                        DevSphere
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col gap-2">
                                {routeList.map(({ href, label }) => (
                                    <Button
                                        key={href}
                                        onClick={() => setIsOpen(false)}
                                        asChild
                                        variant="ghost"
                                        className="justify-start text-base"
                                    >
                                        <Link href={href}>{label}</Link>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <SheetFooter className="flex-col sm:flex-col justify-start items-start">
                            <Separator className="mb-2" />
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            {/* <!-- Desktop --> */}
            <NavigationMenu className="hidden lg:block mx-auto">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-card text-base">
                            About Us
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="grid w-[600px] grid-cols-2 gap-5 p-4">
                                <Image
                                    src={devgif}
                                    alt="RadixLogo"
                                    className="h-full w-full rounded-md object-cover"
                                    width={600}
                                    height={600}
                                />
                                <ul className="flex flex-col gap-2">
                                    {featureList.map(({ title, description, href }) => (
                                        <li key={title} className="rounded-md p-3 text-sm hover:bg-muted">
                                            <Link href={href} className="block">
                                                <p className="mb-1 font-semibold leading-none text-foreground">
                                                    {title}
                                                </p>
                                                <p className="line-clamp-2 text-muted-foreground">
                                                    {description}
                                                </p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        {routeList.map(({ href, label }) => (
                            <NavigationMenuLink key={href} asChild>
                                <Link
                                    href={href}
                                    className="text-base px-4"
                                >
                                    {label}
                                </Link>
                            </NavigationMenuLink>
                        ))}
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <div className="hidden lg:flex">
                {/* <ToggleTheme /> removing light mode (for now)*/}

                <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    aria-label="View on GitHub"
                >
                    <Link
                        aria-label="View on GitHub"
                        href="https://github.com/0xDevSphere"
                        target="_blank"
                    >
                        <Github className="size-5" />
                    </Link>
                </Button>
            </div>
        </header>
    );
};
