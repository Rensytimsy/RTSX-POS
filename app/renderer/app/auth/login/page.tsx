"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Store,
  Mail,
  Users,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Zap,
} from "lucide-react"

// Import your custom schema
import { storeSignUpSchema } from '../../../../lib/types';


type SignupFormValues = z.infer<typeof storeSignUpSchema>

export default function TenantSignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(storeSignUpSchema),
    defaultValues: {
      storename: "",
      email: "",
      companySize: undefined,
      password: "",
      phonenumber: "",
    },
  })

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    try {
      console.log("Submitted Data:", data)
      // Call your API action here
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-secondary flex items-center justify-center p-4 lg:p-8 font-sans antialiased">

      <div className="relative w-full max-w-5xl bg-[#092328]/80  rounded-sm shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Branding Panel */}
        <div className="lg:col-span-5 bg-secondary p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#12544F]/50 relative overflow-hidden">
          <div className="relative z-10">
            {/* Logo Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#2A835F] flex items-center justify-center text-white ">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                RTSX-Store Manager
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Create your tenant account in minutes.
            </h1>
            <p className="text-white text-sm leading-relaxed mb-8">
              Get full access to your custom store workspace, manage teams, and start scaling with ease.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1.5 p-1 rounded-md bg-siteBlack text-white">
                  
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Instant Store Provisioning</h4>
                  <p className="text-xs text-gray-400">Your workspace URL ready in seconds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1.5 p-1 rounded-md bg-siteBlack text-white">
                  
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Enterprise Security</h4>
                  <p className="text-xs text-gray-400">Isolated database multi-tenancy & encrypted store data.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1.5 p-1 rounded-md bg-siteBlack text-white">
                  
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Multi-Member Team Scaling</h4>
                  <p className="text-xs text-gray-400">Tailored user limits based on company size.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-soft text-xs text-white flex items-center justify-between">
            <span>© RTSX Pos</span>
            <span className="text-white hover:underline cursor-pointer">Support</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-8 lg:p-12 bg-white">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-siteBlack tracking-tight">Setup Store Account</h2>
              <p className="text-xs text-siteBlack mt-1">
                Fill in the details below to complete your registration.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Store Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-siteBlack flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-siteBlack" /> Store Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. rtstudio store 144"
                    {...register("storename")}
                    className={`w-full h-10 px-3.5 bg-white text-white placeholder-gray-500 rounded-md border text-sm transition-all outline-none focus:ring-2 focus:ring-[#8BBB92]/50 ${
                      errors.storename
                        ? "border-red-500/80 focus:border-red-500"
                        : "border-[#12544F] focus:border-[#2A835F]"
                    }`}
                  />
                </div>
                {errors.storename && (
                  <p className="text-[11px] text-red-400 font-medium">{errors.storename.message as string}</p>
                )}
              </div>

              {/* Referrer / Contact Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-siteBlack flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-siteBlack" /> Referrer / Contact Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@company.com"
                    {...register("email")}
                    className={`w-full h-10 px-3.5 bg-white text-white placeholder-gray-500 rounded-md border text-sm transition-all outline-none focus:ring-2 focus:ring-[#8BBB92]/50 ${
                      errors.email
                        ? "border-red-500/80 focus:border-red-500"
                        : "border-[#12544F] focus:border-[#2A835F]"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400 font-medium">{errors.email.message as string}</p>
                )}
              </div>

              {/* Company Size & Phone Number Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Company Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-siteBlack flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-siteBlack" /> Company Size
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    {...register("companySize", { valueAsNumber: true })}
                    className={`w-full h-10 px-3.5 bg-white text-white placeholder-gray-500 rounded-md border text-sm transition-all outline-none focus:ring-2 focus:ring-[#8BBB92]/50 ${
                      errors.companySize
                        ? "border-red-500/80 focus:border-red-500"
                        : "border-[#12544F] focus:border-[#2A835F]"
                    }`}
                  />
                  {errors.companySize && (
                    <p className="text-[11px] text-red-400 font-medium">{errors.companySize.message as string}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-siteBlack flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-siteBlack" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...register("phonenumber")}
                    className={`w-full h-10 px-3.5 bg-white text-white placeholder-gray-500 rounded-md border text-sm transition-all outline-none focus:ring-2 focus:ring-[#8BBB92]/50 ${
                      errors.phonenumber
                        ? "border-red-500/80 focus:border-red-500"
                        : "border-[#12544F] focus:border-[#2A835F]"
                    }`}
                  />
                  {errors.phonenumber && (
                    <p className="text-[11px] text-red-400 font-medium">{errors.phonenumber.message as string}</p>
                  )}
                </div>

              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-siteBlack flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-siteBlack" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    {...register("password")}
                    className={`w-full h-10 pl-3.5 pr-10 bg-white text-siteBlack placeholder-gray-500 rounded-md border text-sm transition-all outline-none focus:ring-2 focus:ring-[#8BBB92]/50 ${
                      errors.password
                        ? "border-red-500/80 focus:border-red-500"
                        : "border-[#12544F] focus:border-[#2A835F]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-400 font-medium">{errors.password.message as string}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 mt-2 bg-[#2A835F] hover:bg-[#12544F] active:scale-[0.99] text-white font-medium text-sm rounded-md shadow-lg shadow-[#2A835F]/25 hover:shadow-[#12544F]/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Store Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              {/* Footer Terms */}
              <p className="text-[11px] text-center text-gray-400 pt-2">
                By clicking "Create Store Account", you agree to our{" "}
                <a href="#" className="text-[#8BBB92] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#8BBB92] hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}