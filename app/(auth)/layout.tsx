import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F9F5EE] flex flex-col">
      <nav className="px-6 py-4">
        <Link href="/">
          <Image
            src="/images/logo/pacehive-horizontal-dark.svg"
            alt="PaceHive"
            width={130}
            height={34}
          />
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
