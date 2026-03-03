'use client'
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { LucideIcon } from "lucide-react";

export const HoverEffect = ({
    items,
    className,
}: {
    items: {
        title: string;
        description: string;
        link: string;
        icon?: LucideIcon;
    }[];
    className?: string;
}) => {
    let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
                className
            )}
        >
            {items.map((item, idx) => (
                <a
                    href={item?.link}
                    key={item?.link}
                    className="relative group block p-2 h-full w-full"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-accent-red/10 block rounded-3xl"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <Card>
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-4">
                                {item.icon && (
                                    <div className="p-3 bg-accent-red/10 rounded-xl group-hover:bg-accent-red/20 transition-colors duration-300">
                                        <item.icon className="w-8 h-8 text-accent-red" />
                                    </div>
                                )}
                                <div className="text-accent-red/20 font-space-grotesk font-bold text-4xl group-hover:text-accent-red/40 transition-colors duration-300">
                                    0{idx + 1}
                                </div>
                            </div>
                            <CardTitle>{item.title}</CardTitle>
                            <CardDescription>{item.description}</CardDescription>
                        </div>
                    </Card>
                </a>
            ))}
        </div>
    );
};

export const Card = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "rounded-2xl h-full w-full p-8 overflow-hidden bg-bg-primary/50 backdrop-blur-sm border border-border-primary group-hover:border-accent-red/30 relative z-20 transition-all duration-300",
                className
            )}
        >
            <div className="relative z-50">
                <div className="">{children}</div>
            </div>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
};

export const CardTitle = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <h4 className={cn("text-2xl font-bold font-space-grotesk text-text-primary tracking-wide uppercase mb-2", className)}>
            {children}
        </h4>
    );
};

export const CardDescription = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <p
            className={cn(
                "mt-4 text-text-secondary tracking-wide leading-relaxed text-sm font-light",
                className
            )}
        >
            {children}
        </p>
    );
};
