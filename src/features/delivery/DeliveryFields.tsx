import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus, Check } from "lucide-react";
import { PlatformPicker } from "./PlatformPicker";
import { DateInput } from "../../components/DateInput";
export function DeliveryFields({
  data,
  initialPlatform,
}: {
  data: any;
  initialPlatform?: string;
}) {
  const [platform, setPlatform] = useState(
      initialPlatform || data.platforms[0] || "",
    ),
    [incentive, setIncentive] = useState(false);
  const plan = data.deliveryPlatformSettings?.[platform] || {},
    bank = data.accounts.find((bank: any) => bank.id === plan.accountId),
    reduce = useReducedMotion();
  return (
    <div className="delivery-form-fields">
      <PlatformPicker
        names={data.platforms}
        settings={data.deliveryPlatformSettings || {}}
        initialValue={platform}
        onChange={setPlatform}
      />
      <p className="delivery-account-note">
        {bank
          ? `Conta de repasse: ${bank.title}. Altere nas configurações de ${platform}.`
          : `Configure a conta de repasse em Entregas → ${platform} antes de salvar.`}
      </p>
      <input type="hidden" name="accountId" value={plan.accountId || ""} />
      <input
        type="hidden"
        name="receiptStatus"
        value={plan.receiptStatus || "pending"}
      />
      <label className="field">
        Nome do estabelecimento
        <input
          name="title"
          required
          maxLength={120}
          placeholder="Ex.: Pizza Central"
        />
      </label>
      <label className="field">
        Endereço de coleta (opcional)
        <input name="pickup" maxLength={240} />
      </label>
      <label className="field">
        Endereço de entrega (opcional)
        <input name="destination" maxLength={240} />
      </label>
      <div className="compact-field-pair">
        <label className="field">
          Valor da entrega (R$)
          <input
            name="amount"
            inputMode="decimal"
            required
            placeholder="0,00"
          />
        </label>
        <label className="field">
          Distância (km, opcional)
          <input name="km" inputMode="decimal" placeholder="Ex.: 4,5" />
        </label>
      </div>
      <div className="delivery-incentive">
        <motion.button
          type="button"
          className="incentive-toggle"
          aria-label="Incentivo na entrega"
          aria-pressed={incentive}
          onClick={() => setIncentive(!incentive)}
          whileTap={reduce ? undefined : { scale: 0.94 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={String(incentive)}
              initial={{ opacity: 0, rotate: reduce ? 0 : -30, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: reduce ? 0 : 0.18 }}
            >
              {incentive ? <Check size={18} /> : <Plus size={18} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <span>Incentivo na entrega</span>
      </div>
      <AnimatePresence>
        {incentive && (
          <motion.label
            className="field compact-amount"
            initial={{ opacity: 0, y: reduce ? 0 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.22 }}
          >
            Valor do incentivo (R$)
            <input
              aria-label="Valor do incentivo (R$)"
              name="incentive"
              inputMode="decimal"
              required
              placeholder="0,00"
            />
            <small>Somado ao valor da entrega uma única vez.</small>
          </motion.label>
        )}
      </AnimatePresence>
      <label className="field compact-date">
        Data da entrega
        <DateInput
          name="date"
          required
          defaultValue={new Date().toLocaleDateString("sv-SE")}
          aria-label="Data da entrega"
        />
      </label>
    </div>
  );
}
