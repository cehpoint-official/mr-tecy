"use client";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <LoginForm
            mode="customer"
            redirectPath="/"
            title="Welcome back"
            description="Enter your credentials to access your account"
        />
    );
}
