import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowUpRight, Plus, Target } from "lucide-react";
import { FaLayerGroup, FaChartPie } from "react-icons/fa";
import { CarouselNavigator, AnimatedMoney, MotionCard } from "./nexo-ui";
import { FilterDisclosure } from "./reference/FilterDisclosure";
import { TaskWidget, type TaskData } from "./reference/TaskWidget";

export type DashboardOverviewGroup = {
  id: string;
  title: string;
  kpis: {
    label: string;
    value: string;
    tone?: "positive" | "negative" | "neutral";
    icon?: ReactNode;
  }[];
  actionLabel?: string;
  onAction?: () => void;
};

export function DashboardOverview({
  groups,
  taskData,
  onCreateGoal,
  periodControl,
}: {
  groups: DashboardOverviewGroup[];
  taskData: TaskData;
  onCreateGoal: () => void;
  periodControl?: ReactNode;
}) {
  const scope = useId();
  const [filter, setFilter] = useState("all");
  const [index, setIndex] = useState(0);
  const visibleGroups =
    filter === "all" ? groups : groups.filter((group) => group.id === filter);
  const pages = visibleGroups.flatMap((group) =>
    Array.from({ length: Math.ceil(group.kpis.length / 2) }, (_, offset) => ({
      id: `${group.id}-${offset}`,
      group,
      kpis: group.kpis.slice(offset * 2, offset * 2 + 2),
    })),
  );
  const currentIndex = pages.length ? Math.min(index, pages.length - 1) : 0;
  const current = pages[currentIndex];
  const selectedGroup = groups.find((group) => group.id === filter);
  return (
    <LayoutGroup id={scope}>
      <div className="dashboard-overview">
        <MotionCard
          className="dashboard-overview-card"
          aria-label="Seus indicadores financeiros"
        >
          {periodControl}
          <header className="dashboard-overview-heading">
            <div>
              <p className="eyebrow">RESUMO DO PERÍODO</p>
              <h2>Indicadores</h2>
            </div>
            <div className="dashboard-overview-filter">
              <span>Filtrar indicadores</span>
              <FilterDisclosure
                label="Filtrar indicadores"
                defaultActiveId="all"
                items={[
                  {
                    id: "all",
                    label: "Todos os indicadores",
                    icon: FaLayerGroup,
                  },
                  ...groups.map((group) => ({
                    id: group.id,
                    label: group.title,
                    icon: FaChartPie,
                  })),
                ]}
                onChange={(id) => {
                  setFilter(id);
                  setIndex(0);
                }}
              />
            </div>
          </header>
          <p className="dashboard-overview-category" aria-live="polite">
            {selectedGroup?.title ?? "Todos os indicadores"}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            {current ? (
              <motion.div
                key={current.id + current.kpis.map(kpi => kpi.value).join()}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(3px)" }}
                transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
                className="dashboard-overview-page"
                aria-live="polite"
                role="group"
                aria-roledescription="slide"
                aria-label={`${current.group.title}, ${currentIndex + 1} de ${pages.length}`}
              >
                <h3>{current.group.title}</h3>
                <dl className="dashboard-overview-kpis">
                  {current.kpis.map((kpi, offset) => (
                    <div
                      className={`dashboard-overview-kpi tone-${kpi.tone ?? "neutral"}`}
                      key={`${kpi.label}-${offset}`}
                    >
                      <dt>
                        {kpi.icon ? (
                          <span
                            className="dashboard-overview-icon"
                            aria-hidden="true"
                          >
                            {kpi.icon}
                          </span>
                        ) : null}
                        {kpi.label}
                      </dt>
                      <dd>{kpi.value.includes("R$") ? <AnimatedMoney value={Math.round(Number(kpi.value.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".")) * 100) * (kpi.tone === "negative" ? -1 : 1)} signed fromZero /> : kpi.value}</dd>
                    </div>
                  ))}
                </dl>
                {current.group.actionLabel && current.group.onAction ? (
                  <button
                    type="button"
                    className="dashboard-overview-action"
                    onClick={current.group.onAction}
                  >
                    {current.group.actionLabel}
                    <ArrowUpRight size={16} />
                  </button>
                ) : null}
              </motion.div>
            ) : (
              <p className="dashboard-overview-empty">
                Nenhum indicador disponível nesta categoria.
              </p>
            )}
          </AnimatePresence>
          {pages.length > 0 ? (
            <footer className="dashboard-overview-footer">
              <span>
                {currentIndex + 1} de {pages.length}
              </span>
              <CarouselNavigator
                totalSlides={pages.length}
                currentIndex={currentIndex}
                onIndexChange={setIndex}
                autoDelay={0}
                autoPlay={false}
              />
            </footer>
          ) : null}
        </MotionCard>
        <MotionCard
          className="dashboard-overview-goals"
          aria-label="Progresso das metas"
        >
          <div className="dashboard-overview-goals-heading">
            <Target size={17} />
            <h2>Metas</h2>
          </div>
          <TaskWidget data={taskData} initialOpen />
          {taskData.totalCount === 0 ? (
            <div className="dashboard-overview-goals-empty">
              <p>Nenhuma meta cadastrada.</p>
              <button
                type="button"
                className="dashboard-overview-action"
                onClick={onCreateGoal}
              >
                <Plus size={17} />
                Criar meta
              </button>
            </div>
          ) : null}
        </MotionCard>
      </div>
    </LayoutGroup>
  );
}
