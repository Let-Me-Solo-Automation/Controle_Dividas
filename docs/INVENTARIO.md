# Inventário e dependências

## Dependências declaradas

| Pacote | Versão | Tipo |
| --- | --- | --- |
| @hugeicons/core-free-icons | ^4.4.0 | dependencies |
| @hugeicons/react | ^1.1.10 | dependencies |
| fflate | ^0.8.3 | dependencies |
| firebase | ^13.2.0 | dependencies |
| lucide-react | ^1.72.0 | dependencies |
| motion | ^14.12.0 | dependencies |
| react | ^19.3.1 | dependencies |
| react-dom | ^19.3.1 | dependencies |
| react-icons | ^5.7.0 | dependencies |
| react-use-measure | ^2.1.7 | dependencies |
| @firebase/rules-unit-testing | ^6.0.0 | devDependencies |
| @playwright/test | ^1.65.0 | devDependencies |
| @tailwindcss/cli | ^4.3.5 | devDependencies |
| @tailwindcss/vite | ^4.3.5 | devDependencies |
| @types/react | ^19.3.0 | devDependencies |
| @types/react-dom | ^19.3.0 | devDependencies |
| @vitejs/plugin-react | ^6.3.0 | devDependencies |
| esbuild | ^0.28.2 | devDependencies |
| firebase-tools | ^15.35.0 | devDependencies |
| prettier | ^3.9.10 | devDependencies |
| tailwindcss | ^4.3.5 | devDependencies |
| typescript | ^7.0.2 | devDependencies |
| vite | ^8.3.8 | devDependencies |

## Fontes e scripts

```text
src/app-entry.tsx
src/apple-themes.js
src/brand.ts
src/components/AnimatedDisclosure.tsx
src/components/AnimatedFinanceChart.tsx
src/components/BrandIcon.tsx
src/components/ComponentGallery.tsx
src/components/DashboardOverview.tsx
src/components/DeliveryRouteMap.css
src/components/DeliveryRouteMap.tsx
src/components/FinanceCalendar.css
src/components/FinanceCalendar.tsx
src/components/FirebaseSharing.tsx
src/components/GoalMetaEditor.tsx
src/components/GoalTargetEditor.tsx
src/components/LiquidDangerButton.tsx
src/components/PersonalizationStudio.tsx
src/components/ProductionInteractions.tsx
src/components/ReserveWorkspace.tsx
src/components/SaveToggleButton.tsx
src/components/dashboard-overview.css
src/components/nexo-ui.tsx
src/components/personalization-studio.css
src/components/production-interactions.css
src/components/reference/AccordionApp.tsx
src/components/reference/ActivitiesCard.tsx
src/components/reference/AdaptiveSlider.tsx
src/components/reference/CalendarWidget.tsx
src/components/reference/CommandSearch.tsx
src/components/reference/FilterDisclosure.tsx
src/components/reference/InviteDisclosure.tsx
src/components/reference/OptionPicker.tsx
src/components/reference/PinItemComponent.tsx
src/components/reference/SlotPicker.tsx
src/components/reference/SwitchDisclosure.tsx
src/components/reference/TaskWidget.tsx
src/components/reference/ViewOnMap.tsx
src/components/reserve-workspace.css
src/features/forecast/CashflowForecast.tsx
src/features/trash/TrashPanel.tsx
src/features/trash/model.ts
src/legacy/NexoApp.jsx
src/legacy/base.css
src/legacy/domain.js
src/legacy/fonts.css
src/lib/reserve-model.ts
src/lib/utils.ts
src/personalization.js
src/sharing/firebase.ts
src/sharing/model.ts
src/sharing/viewer.css
src/sharing/viewer.tsx
src/simulator-entry.tsx
src/simulator.css
src/stress-preview.ts
src/styles.css
src/use-system-dark.ts
scripts/build-android.sh
scripts/build.mjs
scripts/dev.mjs
scripts/package.mjs
scripts/prepare-android.mjs
scripts/prepare-mac.sh
scripts/setup-firebase.mjs
scripts/test-model.mjs
scripts/test-reserve-model.mjs
scripts/verify-delivery.mjs
android/app/src/main/AndroidManifest.xml
android/app/src/main/java/app/marks/finance/MainActivity.java
android/app/src/main/res/drawable/marks_icon.png
firebase/firestore.rules
tests/android-assets.spec.ts
tests/apple-theme.spec.ts
tests/expansion-extra.spec.ts
tests/expansion.spec.ts
tests/final-refinements.spec.ts
tests/financial-interactions.spec.ts
tests/firebase-e2e.spec.ts
tests/firebase.rules.mjs
tests/glass-settings.spec.ts
tests/motion-refinement.spec.ts
tests/production.spec.ts
tests/simulator.spec.ts
tests/trash-and-styles.spec.ts
public/.nojekyll
public/firebase-config.json
public/tutorial-firebase.html
.github/workflows/pages.yml
```

Assets gráficos e fontes ficam em `src/assets` e `src/legacy/fonts.css`. O inventário omite arquivos gerados e saídas de build.
