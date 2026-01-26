import { Bell, Menu, Wrench } from "lucide-react"
import { SearchBar } from "@/components/SearchBar"
import { CategoryCard } from "@/components/CategoryCard"
import { ServiceCard } from "@/components/ServiceCard"
import { BottomNavigation } from "@/components/BottomNavigation"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-700 hover:text-blue-600">
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-lg font-semibold text-slate-950">Mr Tecy</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-700 hover:text-blue-600 relative">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">A</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-5 space-y-6">
        {/* Search Bar */}
        <SearchBar />

        {/* Categories Section */}
        <section>
          <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">
            Services
          </h2>
          <div className="grid grid-cols-4 gap-3">
            <CategoryCard
              image="https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=400&auto=format&fit=crop&q=80"
              label="Car"
            />
            <CategoryCard
              image="https://images.unsplash.com/photo-1558981852-426c6c22a060?w=400&auto=format&fit=crop&q=80"
              label="Bike"
            />
            <CategoryCard
              image="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&auto=format&fit=crop&q=80"
              label="Electrician"
            />
            <CategoryCard
              image="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80"
              label="Mobile"
            />
          </div>
        </section>

        {/* Promotional Banner */}
        <section>
          <div className="relative h-40 rounded-2xl overflow-hidden shadow-md">
            {/* Professional mechanic background image */}
            <img
              src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format&fit=crop&q=80"
              alt="Professional mechanic at work"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/70 z-10"></div>
            <div className="absolute inset-0 z-20 flex items-center px-6">
              <div className="max-w-[60%]">
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                  Get your car fixed at home
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-slate-50 font-semibold shadow-md text-xs h-9"
                >
                  Book a Mechanic →
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Recommended Services
            </h2>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ServiceCard
              title="Smart TV Repair"
              description="Expert technicians for all TV brands and models"
              image="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&auto=format&fit=crop&q=80"
              price="₹299"
            />
            <ServiceCard
              title="Washing Machine"
              description="Professional repair for automatic and manual machines"
              image="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&auto=format&fit=crop&q=80"
              price="₹199"
            />
            <ServiceCard
              title="AC Service"
              description="Complete servicing and maintenance for all AC types"
              image="https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400&auto=format&fit=crop&q=80"
              price="₹399"
              badge="Popular"
            />
            <ServiceCard
              title="Refrigerator Repair"
              description="Fast and reliable fridge repair services"
              image="https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&auto=format&fit=crop&q=80"
              price="₹349"
            />
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
