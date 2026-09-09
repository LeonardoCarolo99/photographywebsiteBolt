import { Award, Camera, Flag, MapPin } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(212,175,55,0.3) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <h1 className="font-display text-5xl leading-none tracking-wide text-white md:text-7xl">
            ABOUT <span className="text-gold-400">ME</span>
          </h1>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
              <Camera className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-2xl tracking-wide text-gold-400">THE PHOTOGRAPHER</h2>
              <p className="mt-3 font-body text-base font-light leading-relaxed text-gray-300">
                I'm a motorsport photographer with a passion for capturing the raw energy, speed, and emotion of competitive racing. From the screech of tires on tarmac to the roar of engines on dirt, I've spent years trackside, chasing that perfect frame where motion and moment collide.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
              <Flag className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-2xl tracking-wide text-gold-400">THE WORK</h2>
              <p className="mt-3 font-body text-base font-light leading-relaxed text-gray-300">
                My work spans the full spectrum of motorsport — circuit racing, rally, MotoGP, Formula 1, and drag racing. I strive to go beyond the obvious shot, finding the stories in the paddock, the pit lane, and the grandstands. Every race is a new canvas, and every lap brings a fresh perspective.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
              <Award className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-2xl tracking-wide text-gold-400">THE APPROACH</h2>
              <p className="mt-3 font-body text-base font-light leading-relaxed text-gray-300">
                I believe great motorsport photography is about more than sharp focus and fast shutter speeds. It's about conveying the atmosphere of race day — the tension on the grid, the euphoria of the podium, the quiet intensity of the garage. My goal is to make you feel like you were there, even if you weren't.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
              <MapPin className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-2xl tracking-wide text-gold-400">BASED & AVAILABLE</h2>
              <p className="mt-3 font-body text-base font-light leading-relaxed text-gray-300">
                Available for commissions, event coverage, and editorial assignments worldwide. Whether it's a full race weekend or a private test session, I'm ready to travel to wherever the action is.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center">
          <p className="font-body text-sm text-gray-500">
            For bookings and inquiries, please visit the <span className="text-gold-400">Contact</span> page.
          </p>
        </div>
      </section>
    </div>
  );
}
