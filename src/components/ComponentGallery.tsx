import { useState, type ReactNode } from "react";
import { LayoutGroup } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Folder,
  Landmark,
  Lock,
  ShieldCheck,
  Sparkles,
  Target,
  Truck,
  Wallet,
} from "lucide-react";
import { FaBell, FaTasks } from "react-icons/fa";
import { AdaptiveSlider } from "./reference/AdaptiveSlider";
import { CommandSearch } from "./reference/CommandSearch";
import { FilterDisclosure } from "./reference/FilterDisclosure";
import { InviteDisclosure } from "./reference/InviteDisclosure";
import { PinItemComponent } from "./reference/PinItemComponent";
import { OptionPicker } from "./reference/OptionPicker";
import { SlotPicker } from "./reference/SlotPicker";
import { SwitchDisclosure } from "./reference/SwitchDisclosure";
import { TaskWidget } from "./reference/TaskWidget";
import { ViewOnMap } from "./reference/ViewOnMap";
import { ActivitiesCard } from "./reference/ActivitiesCard";
import { CalendarWidget } from "./reference/CalendarWidget";
import { AccordionApp } from "./reference/AccordionApp";
import {
  CarouselNavigator,
  ContextualAIBar,
  ContinuousTabs,
  CreateNewDisclosure,
  DiscreteTabs,
  FluidTabs,
} from "./nexo-ui";

function Example({
  name,
  description,
  children,
}: {
  name: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <LayoutGroup id={name}>
      <section className="gallery-example">
        <div className="gallery-caption">
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
        <div className="gallery-canvas">{children}</div>
      </section>
    </LayoutGroup>
  );
}
export function ComponentGallery({ notify }: { notify?: (s: string) => void }) {
  const [slide, setSlide] = useState(0),
    [group, setGroup] = useState("navigation");
  const say = (s: string) => notify?.(s);
  const date = new Date();
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-11`;
  return (
    <div className="component-gallery">
      <p className="gallery-intro">
        Componentes dos exemplos enviados, organizados para validação. As
        interações desta área usam dados ilustrativos e não alteram suas
        finanças.
      </p>
      <ContinuousTabs
        label="Grupo de componentes"
        tabs={[
          { id: "navigation", label: "Navegação" },
          { id: "controls", label: "Controles" },
          { id: "cards", label: "Cartões" },
        ]}
        value={group}
        onChange={setGroup}
      />
      {group === "navigation" && (
        <>
          <Example
            name="CarouselNavigator"
            description="Setas, indicadores e progresso. Navegação circular, com pausa para leitura."
          >
            <div className="w-full">
              <div className="gallery-slide mb-4 rounded-3xl p-5">
                <span className="eyebrow">MARKS · {slide + 1} / 4</span>
                <h3 className="mt-3">
                  {
                    [
                      "Tudo começa com clareza.",
                      "Um lugar para cada acordo.",
                      "Seus planos ganham forma.",
                      "Seu ritmo, seu controle.",
                    ][slide]
                  }
                </h3>
              </div>
              <CarouselNavigator
                currentIndex={slide}
                onIndexChange={setSlide}
              />
            </div>
          </Example>
          <Example
            name="ContinuousTabs"
            description="Seleção contínua com mola e identificador isolado."
          >
            <ContinuousTabs
              tabs={[
                { id: "day", label: "Dia" },
                { id: "week", label: "Semana" },
                { id: "month", label: "Mês" },
              ]}
            />
          </Example>
          <Example
            name="FluidTabs"
            description="Menu flutuante usado na navegação principal do Marks."
          >
            <FluidTabs
              tabs={[
                {
                  id: "accounts",
                  label: "Contas",
                  icon: <Landmark size={19} />,
                },
                { id: "income", label: "Entradas", icon: <Wallet size={19} /> },
                { id: "goals", label: "Metas", icon: <Target size={19} /> },
              ]}
              onChange={(id) => say(`Aba selecionada: ${id}`)}
            />
          </Example>
          <Example
            name="DiscreteTabs"
            description="Ícones com rótulos que se expandem na seleção."
          >
            <DiscreteTabs
              tabs={[
                { id: "home", label: "Início", icon: <Wallet size={19} /> },
                {
                  id: "agenda",
                  label: "Agenda",
                  icon: <CalendarDays size={19} />,
                },
                { id: "goals", label: "Metas", icon: <Target size={19} /> },
              ]}
            />
          </Example>
          <Example
            name="CommandSearch"
            description="Comandos pesquisáveis e navegação por teclado."
          >
            <CommandSearch
              items={[
                {
                  id: "agenda",
                  title: "Abrir agenda",
                  section: "Suggestions",
                  icon: <CalendarDays size={17} />,
                  action: () =>
                    say("Demonstração: comando Agenda selecionado."),
                },
                {
                  id: "new",
                  title: "Criar lançamento",
                  section: "Suggestions",
                  icon: <ArrowRight size={17} />,
                  action: () => say("Demonstração: comando Criar selecionado."),
                },
              ]}
            />
          </Example>
          <Example
            name="ContextualAIBar"
            description="Barra expansível adaptada à busca local. A conexão com um serviço de IA fica para a etapa do aplicativo."
          >
            <ContextualAIBar
              placeholder="Buscar nas finanças…"
              tools={[
                <button
                  type="button"
                  key="agenda"
                  aria-label="Atalho agenda"
                  onClick={() => say("Atalho Agenda selecionado.")}
                >
                  <CalendarDays size={20} />
                </button>,
                <button
                  type="button"
                  key="wallet"
                  aria-label="Atalho contas"
                  onClick={() => say("Atalho Contas selecionado.")}
                >
                  <Wallet size={20} />
                </button>,
              ]}
              onSubmit={(q) => say(`Busca de demonstração: ${q}`)}
            />
          </Example>
        </>
      )}
      {group === "controls" && (
        <>
          <Example
            name="AdaptiveSlider"
            description="Controle com valor animado e resposta visual ao arrastar."
          >
            <AdaptiveSlider min={50} max={350} defaultValue={200} />
          </Example>
          <Example
            name="FilterDisclosure"
            description="Filtro que se expande e recolhe após a seleção."
          >
            <FilterDisclosure
              items={[
                { id: "all", label: "Todos", icon: FaTasks },
                { id: "pending", label: "Pendentes", icon: FaBell },
              ]}
              defaultActiveId="all"
              onChange={(id) =>
                say(`Filtro: ${id === "all" ? "Todos" : "Pendentes"}`)
              }
            />
          </Example>
          <Example
            name="OptionPicker"
            description="Escolha de visibilidade para validar a interação."
          >
            <OptionPicker
              options={[
                { id: "private", label: "Privado", icon: Lock },
                { id: "shared", label: "Compartilhado", icon: ShieldCheck },
              ]}
            />
          </Example>
          <Example
            name="SwitchDisclosure"
            description="Alternância com opções secundárias que aparecem em contexto."
          >
            <SwitchDisclosure
              title="Lembretes"
              subOptionLabel="Incluir resumo da semana"
            />
          </Example>
          <Example
            name="SlotPicker"
            description="Seleção de dias e intervalos para planejamento de entregas."
          >
            <SlotPicker
              days={["Seg", "Ter", "Qua"].map((label, i) => ({
                id: String(i),
                label,
                enabled: i === 0,
                slots: i === 0 ? [{ id: "a", from: "09:00", to: "12:00" }] : [],
              }))}
            />
          </Example>
          <Example
            name="CreateNewDisclosure"
            description="Expansão em seis ações; no app, elas abrem os formulários reais."
          >
            <CreateNewDisclosure
              onSelect={(id) => say(`Demonstração: ${id} selecionado.`)}
            />
          </Example>
        </>
      )}
      {group === "cards" && (
        <>
          <Example
            name="InviteDisclosure"
            description="Resumo recolhível com contador de atualizações."
          >
            <InviteDisclosure
              title="No seu radar"
              badgeCount={2}
              invites={[
                {
                  id: "1",
                  title: "Parcela do videogame",
                  description: "Próximo recebimento",
                  icon: <Folder size={18} />,
                  hasUpdate: true,
                },
                {
                  id: "2",
                  title: "Reserva do mês",
                  description: "Revisar aporte planejado",
                  icon: <ShieldCheck size={18} />,
                  hasUpdate: true,
                },
              ]}
            />
          </Example>
          <Example
            name="PinItemComponent"
            description="Itens fixados se reorganizam com animação de layout."
          >
            <PinItemComponent
              items={[
                {
                  id: 1,
                  name: "iFood",
                  type: "Plataforma",
                  status: "Entregas",
                  icon: Truck,
                },
                {
                  id: 2,
                  name: "Nubank",
                  type: "Conta",
                  status: "Saldo disponível",
                  icon: Wallet,
                },
              ]}
            />
          </Example>
          <Example
            name="TaskWidget"
            description="Cartão expansível de etapas para alcançar um objetivo."
          >
            <TaskWidget
              data={{
                title: "Meu próximo notebook",
                progress: 30,
                completedCount: 1,
                totalCount: 3,
                priority: "Normal",
                status: "Em andamento",
                subtasks: [
                  { id: "1", title: "Definir o objetivo", completed: true },
                  { id: "2", title: "Separar aportes", completed: false },
                  { id: "3", title: "Revisar o prazo", completed: false },
                ],
                assignees: [],
              }}
            />
          </Example>
          <Example
            name="ActivitiesCard"
            description="Atividades recentes agrupadas em um cartão expansível."
          >
            <ActivitiesCard
              headerIcon={<Wallet size={20} />}
              title="Últimos movimentos"
              subtitle="Seu histórico, sempre à mão"
              activities={[
                {
                  icon: <Check size={18} />,
                  title: "Pagamento recebido",
                  desc: "Parcela do videogame",
                  time: "Hoje",
                },
                {
                  icon: <Target size={18} />,
                  title: "Aporte na meta",
                  desc: "Meu próximo notebook",
                  time: "Ontem",
                },
              ]}
            />
          </Example>
          <Example
            name="CalendarWidget"
            description="Calendário arrastável com eventos da data selecionada."
          >
            <CalendarWidget
              initialSelectedDate={iso}
              currentMonthYear={date.toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
              events={{ [iso]: [{ title: "Revisar finanças", time: "09:00" }] }}
            />
          </Example>
          <Example
            name="ViewOnMap"
            description="Expansão do cartão de localização; mapa ilustrativo, disponível offline."
          >
            <ViewOnMap address="Área de entregas · demonstração" />
          </Example>
          <Example
            name="AccordionApp"
            description="Informações de apoio com expansão suave."
          >
            <AccordionApp
              items={[
                {
                  id: 1,
                  title: "Onde ficam meus dados?",
                  icon: <ShieldCheck size={18} />,
                  content:
                    "Os registros deste simulador ficam no navegador. Use o backup para levá-los a outro aparelho.",
                },
                {
                  id: 2,
                  title: "Como validar as animações?",
                  icon: <Sparkles size={18} />,
                  content:
                    "Troque as abas, abra formulários e teste os componentes. A preferência de movimento reduzido do sistema é respeitada.",
                },
              ]}
            />
          </Example>
        </>
      )}
    </div>
  );
}
