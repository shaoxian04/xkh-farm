const DETAILS = [
  {
    key: "Farm",
    value: (
      <>
        Jln Ringlet – Sungai Koyan, Bertam Valley,
        <br />
        39200 Ringlet, Pahang, Malaysia
      </>
    ),
  },
  {
    key: "Phone",
    value: (
      <a
        href="tel:+60142580200"
        className="underline underline-offset-4 hover:text-sun"
      >
        +60 14-258 0200
      </a>
    ),
  },
  {
    key: "Email",
    value: (
      <a
        href="mailto:xinkiarhuat88@gmail.com"
        className="break-all underline underline-offset-4 hover:text-sun"
      >
        xinkiarhuat88@gmail.com
      </a>
    ),
  },
  { key: "Open", value: "Every day, 8:00am – 6:00pm" },
  { key: "Supply", value: "Wholesale to businesses and retailers" },
];

export default function Contact() {
  return (
    <>
      <section className="wrap pb-14 pt-16 md:pt-24">
        <h1 className="max-w-[12ch] text-[clamp(3rem,9vw,7rem)]">
          Come and find us
        </h1>
        <p className="mt-6 max-w-xl text-lg text-bone/80">
          The farm is in Bertam Valley, off the Ringlet – Sungai Koyan road. For
          volumes and delivery schedules, message us directly.
        </p>
      </section>

      <section className="wrap grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <dl className="border-t border-bone/15">
            {DETAILS.map((d) => (
              <div key={d.key} className="border-b border-bone/15 py-5">
                <dt className="text-sm text-sage">{d.key}</dt>
                <dd className="mt-1.5 text-[1.0625rem] leading-relaxed">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>

          <a
            href="https://wa.me/60142580200"
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-sun mt-8 w-full sm:w-auto"
          >
            Message us on WhatsApp
          </a>
        </div>

        <div className="lg:col-span-7">
          <iframe
            title="Map showing Xin Kiar Huat Enterprise in Bertam Valley, Pahang"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15934.331613292445!2d101.2981911!3d4.2342956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cb01e77b1085cf%3A0x436881877a7d26c8!2sXin%20Kiar%20Huat%20Enterprise!5e0!3m2!1sen!2smy!4v1700000000000!5m2!1sen!2smy"
            className="block h-[440px] w-full bg-night-2 lg:h-[620px]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </>
  );
}
