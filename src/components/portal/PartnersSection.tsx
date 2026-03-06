import { motion } from "framer-motion";

const partners = [
  "Hospital Albert Einstein",
  "COFEN",
  "COREN-SP",
  "Ministério da Saúde",
  "FIOCRUZ",
  "Hospital Sírio-Libanês",
  "USP Enfermagem",
  "UNIFESP",
];

export function PartnersSection() {
  return (
    <section id="parceiros" className="py-20 bg-muted/30">
      <div className="container">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block rounded-full bg-health-blue-light px-4 py-1 text-sm font-medium text-secondary">
            Parceiros
          </span>
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Nossos parceiros</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Instituições e organizações que confiam no Portal da Enfermagem.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {partners.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex h-24 items-center justify-center rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elevated"
            >
              <span className="text-center text-sm font-semibold text-muted-foreground">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
