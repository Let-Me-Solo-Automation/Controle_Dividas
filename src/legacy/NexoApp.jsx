import { PlatformPicker, PlatformIconField } from "../features/delivery/PlatformPicker";
import {validateDeliveryMetadata} from "../features/delivery/model";
import {DeliveryWorkspace} from "../features/delivery/DeliveryWorkspace";
import { resizeIcon } from "../lib/image-resize";
import {CashflowForecast} from "../features/forecast/CashflowForecast";
import {TrashPanel} from "../features/trash/TrashPanel";
import {normalizeTrash,archiveDeleted,restoreDeleted,purgeExpired} from "../features/trash/model";
import { SaveToggleButton } from "../components/SaveToggleButton";
import themeDomain from './domain.js';
import { DashboardOverview } from '../components/DashboardOverview';
import { GoalTargetEditor } from '../components/GoalTargetEditor';
import { GoalMetaEditor } from '../components/GoalMetaEditor';
import { LiquidDangerButton } from '../components/LiquidDangerButton';
import { AnimatedProgressRing } from '../components/nexo-ui';
import { resolveAppleTheme, systemFontStack } from '../apple-themes.js';
import { useSystemDark } from '../use-system-dark';
import { BrandIcon } from '../components/BrandIcon';
import { FirebaseConnection, FirebaseSectionShare } from '../components/FirebaseSharing';
import { publishSection as publishFirebaseSection, revokeShare as revokeFirebaseShare } from '../sharing/firebase';
// Recovered from the supplied simulator. Financial rules, cents, validation and data schema are preserved.
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { FluidNavigation, ContinuousTabs, AnimatedMoney, MotionProgress, MotionToggle, CommandPalette, CreateGrid, CreateNewDisclosure, ScreenTransition, AppModal, MotionCard, BlurSlider, DashboardTools, MotionAppRoot, ThemeMorphToggle } from '../components/nexo-ui';
import { EntryFilters, RecentActivity, GoalProgress, SectionOrganizer, FinanceAgenda, FinanceHighlights, FinanceShortcuts, FocusDisclosure, FinanceHelp, ContributionPlanner } from '../components/ProductionInteractions';
import { DeliveryRouteMap } from '../components/DeliveryRouteMap';
import { ComponentGallery } from '../components/ComponentGallery';
import { ReserveWorkspace, BankFields, ReserveTransactionFields, bankFromForm } from '../components/ReserveWorkspace';
import { addBank, changeReserve, validateReserveMetadata } from '../lib/reserve-model';
import { normalizePersonalizationSettings } from '../personalization.js';
import { PersonalizationStudio } from '../components/PersonalizationStudio';
import { AnimatedFinanceChart } from '../components/AnimatedFinanceChart';
const ReactCompat = { ...React, default: React };
  var ca = ReactCompat;
  var Lr = ReactCompat;
  var pf = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
    br = (...e) =>
      e
        .filter((a, t, l) => !!a && a.trim() !== "" && l.indexOf(a) === t)
        .join(" ")
        .trim();
  var Zo = ReactCompat;
  var mf = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  var gf = (0, Zo.forwardRef)(
    (
      {
        color: e = "currentColor",
        size: a = 24,
        strokeWidth: t = 2,
        absoluteStrokeWidth: l,
        className: o = "",
        children: u,
        iconNode: i,
        ...d
      },
      s,
    ) =>
      (0, Zo.createElement)(
        "svg",
        {
          ref: s,
          ...mf,
          width: a,
          height: a,
          stroke: e,
          strokeWidth: l ? (Number(t) * 24) / Number(a) : t,
          className: br("lucide", o),
          ...d,
        },
        [
          ...i.map(([c, h]) => (0, Zo.createElement)(c, h)),
          ...(Array.isArray(u) ? u : [u]),
        ],
      ),
  );
  var M = (e, a) => {
    let t = (0, Lr.forwardRef)(({ className: l, ...o }, u) =>
      (0, Lr.createElement)(gf, {
        ref: u,
        iconNode: a,
        className: br(`lucide-${pf(e)}`, l),
        ...o,
      }),
    );
    return ((t.displayName = `${e}`), t);
  };
  var dl = M("ArrowDownLeft", [
    ["path", { d: "M17 7 7 17", key: "15tmo1" }],
    ["path", { d: "M17 17H7V7", key: "1org7z" }],
  ]);
  var Da = M("ArrowUpRight", [
    ["path", { d: "M7 7h10v10", key: "1tivn9" }],
    ["path", { d: "M7 17 17 7", key: "1vkiza" }],
  ]);
  var sl = M("Bell", [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
    [
      "path",
      {
        d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
        key: "11g9vi",
      },
    ],
  ]);
  var Ta = M("Bike", [
    ["circle", { cx: "18.5", cy: "17.5", r: "3.5", key: "15x4ox" }],
    ["circle", { cx: "5.5", cy: "17.5", r: "3.5", key: "1noe27" }],
    ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
    ["path", { d: "M12 17.5V14l-3-3 4-3 2 3h2", key: "1npguv" }],
  ]);
  var Ra = M("CalendarDays", [
    ["path", { d: "M8 2v4", key: "1cmpym" }],
    ["path", { d: "M16 2v4", key: "4m81vk" }],
    [
      "rect",
      { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" },
    ],
    ["path", { d: "M3 10h18", key: "8toen8" }],
    ["path", { d: "M8 14h.01", key: "6423bh" }],
    ["path", { d: "M12 14h.01", key: "1etili" }],
    ["path", { d: "M16 14h.01", key: "1gbofw" }],
    ["path", { d: "M8 18h.01", key: "lrp35t" }],
    ["path", { d: "M12 18h.01", key: "mhygvu" }],
    ["path", { d: "M16 18h.01", key: "kzsmim" }],
  ]);
  var Ze = M("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
  var $a = M("ChevronLeft", [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]]);
  var Pe = M("ChevronRight", [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]]);
  var At = M("CircleCheck", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
  ]);
  var Mt = M("CircleHelp", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }],
  ]);
  var Ko = M("Clock", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }],
  ]);
  var Yl = M("Download", [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
    ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
    ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }],
  ]);
  var et = M("Ellipsis", [
    ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
    ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
    ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }],
  ]);
  var Jo = M("ExternalLink", [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "M10 14 21 3", key: "gplh6r" }],
    [
      "path",
      {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
        key: "a6xqqp",
      },
    ],
  ]);
  var fl = M("EyeOff", [
    [
      "path",
      {
        d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
        key: "ct8e1f",
      },
    ],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
    [
      "path",
      {
        d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
        key: "13bj9a",
      },
    ],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ]);
  var Ql = M("Eye", [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
        key: "1nclc0",
      },
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ]);
  var Dt = M("House", [
    [
      "path",
      { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" },
    ],
    [
      "path",
      {
        d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        key: "1d0kgt",
      },
    ],
  ]);
  var Tt = M("Image", [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
        ry: "2",
        key: "1m3agn",
      },
    ],
    ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
    ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ]);
  var Bt = M("Info", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 16v-4", key: "1dtifu" }],
    ["path", { d: "M12 8h.01", key: "e9boi3" }],
  ]);
  var ta = M("Layers", [
    [
      "path",
      {
        d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
        key: "zw3jo",
      },
    ],
    [
      "path",
      {
        d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
        key: "1wduqc",
      },
    ],
    [
      "path",
      {
        d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
        key: "kqbvx6",
      },
    ],
  ]);
  var Zl = M("Link", [
    [
      "path",
      {
        d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
        key: "1cjeqo",
      },
    ],
    [
      "path",
      {
        d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
        key: "19qd67",
      },
    ],
  ]);
  var Wo = M("MapPin", [
    [
      "path",
      {
        d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
        key: "1r0f0z",
      },
    ],
    ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
  ]);
  var Ro = M("Menu", [
    ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
    ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
    ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }],
  ]);
  var $o = M("Moon", [
    ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }],
  ]);
  var eu = M("Palette", [
    [
      "circle",
      { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" },
    ],
    [
      "circle",
      { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" },
    ],
    [
      "circle",
      { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" },
    ],
    [
      "circle",
      { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" },
    ],
    [
      "path",
      {
        d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",
        key: "12rzf8",
      },
    ],
  ]);
  var Kl = M("Pin", [
    ["path", { d: "M12 17v5", key: "bb1du9" }],
    [
      "path",
      {
        d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
        key: "1nkz8b",
      },
    ],
  ]);
  var be = M("Plus", [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }],
  ]);
  var cl = M("Receipt", [
    [
      "path",
      {
        d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        key: "q3az6g",
      },
    ],
    ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
    ["path", { d: "M12 17.5v-11", key: "1jc1ny" }],
  ]);
  var zt = M("Repeat", [
    ["path", { d: "m17 2 4 4-4 4", key: "nntrym" }],
    ["path", { d: "M3 11v-1a4 4 0 0 1 4-4h14", key: "84bu3i" }],
    ["path", { d: "m7 22-4-4 4-4", key: "1wqhfi" }],
    ["path", { d: "M21 13v1a4 4 0 0 1-4 4H3", key: "1rx37r" }],
  ]);
  var pl = M("RotateCcw", [
    [
      "path",
      { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" },
    ],
    ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ]);
  var tt = M("Share2", [
    ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
    ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
    ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
    [
      "line",
      { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" },
    ],
    [
      "line",
      { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" },
    ],
  ]);
  var Et = M("ShieldCheck", [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y",
      },
    ],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
  ]);
  var au = M("Shuffle", [
    ["path", { d: "m18 14 4 4-4 4", key: "10pe0f" }],
    ["path", { d: "m18 2 4 4-4 4", key: "pucp1d" }],
    [
      "path",
      {
        d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22",
        key: "1ailkh",
      },
    ],
    ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2", key: "km57vx" }],
    ["path", { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45", key: "os18l9" }],
  ]);
  var tu = M("SlidersHorizontal", [
    ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
    ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
    ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
    ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
    ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
    ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
    ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
    ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
    ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }],
  ]);
  var Ot = M("Sparkles", [
    [
      "path",
      {
        d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
        key: "4pj2yx",
      },
    ],
    ["path", { d: "M20 3v4", key: "1olli1" }],
    ["path", { d: "M22 5h-4", key: "1gvqau" }],
    ["path", { d: "M4 17v2", key: "vumght" }],
    ["path", { d: "M5 18H3", key: "zchphs" }],
  ]);
  var lu = M("Sun", [
    ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M12 20v2", key: "1lh1kg" }],
    ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
    ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "M20 12h2", key: "1q8mjw" }],
    ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
    ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }],
  ]);
  var Pa = M("Target", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
    ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ]);
  var Ge = M("Trash2", [
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
    ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
    ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
    ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }],
  ]);
  var ou = M("TrendingUp", [
    ["polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17", key: "126l90" }],
    ["polyline", { points: "16 7 22 7 22 13", key: "kwv8wd" }],
  ]);
  var ml = M("Upload", [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
    ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
    ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }],
  ]);
  var lt = M("Wallet", [
    [
      "path",
      {
        d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
        key: "18etb6",
      },
    ],
    ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }],
  ]);
  var uu = M("X", [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ]);
  var ru = {
      menuStyle: [
        ["popover", "Flutuante"],
        ["drawer", "Gaveta"],
        ["compact", "Barra de \xEDcones"],
      ],
      nav: [["neon", "Vidro neon"],
        ["capsule", "C\xE1psula"],
        ["dock", "Dock"],
        ["island", "Ilha"],
        ["centered", "Central"],
        ["minimal", "Minimal"],
        ["elevated", "Elevada"],
      ],
      switchStyle: [
        ["soft", "Suave"],
        ["sculpted", "Esculpido"],
        ["daynight", "Dia e noite"],
        ["glass", "Vidro"],
      ],
      buttonStyle: [
        ["solid", "S\xF3lido"],
        ["raised", "Relevo"],
        ["glass", "Vidro"],
        ["orbital", "Orbital"],
      ],
      cardStyle: [
        ["theme", "Escolhido pelo tema"],
        ["soft", "Suave"],
        ["glass", "Vidro"],
        ["outline", "Contorno"],
        ["textured", "Textura"],
      ],
      calendarStyle: [
        ["classic", "Cl\xE1ssico"],
        ["rings", "An\xE9is"],
      ],
      iconStyle: [
        ["outline", "Tra\xE7o fino"],
        ["duotone", "Duotone"],
      ],
    },
    hf = {
      menuStyle: "Estilo do menu",
      switchStyle: "Estilo dos interruptores",
      buttonStyle: "Estilo dos bot\xF5es",
      cardStyle: "Estilo dos cart\xF5es",
      calendarStyle: "Estilo do calend\xE1rio",
      iconStyle: "Estilo dos \xEDcones",
    };
  function xf(e) {
    for (let [a, t] of Object.entries(ru))
      t.some(([l]) => l === e[a]) || (e[a] = t[0][0]);
    if (
      ((e.blurStrength = Math.min(
        28,
        Math.max(0, Number.isFinite(Number(e.blurStrength)) ? Number(e.blurStrength) : 20),
      )),
      (e.intensity = Math.min(2, Math.max(0.4, Number(e.intensity) || 1))),
      e.heroImage &&
        !/^data:image\/(jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(
          e.heroImage,
        ))
    )
      throw Error("Imagem de personaliza\xE7\xE3o inv\xE1lida.");
    return e;
  }
  var ee = () => crypto.randomUUID(),
    Ve = () => {
      let e = new Date();
      return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
    },
    ye = (e) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(e / 100),
    fa = (e) =>
      e
        ? new Date(e + "T12:00:00").toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          })
        : "Sem data";
  function Rl(e) {
    let a = String(e)
      .trim()
      .replace(/R\$\s*/, "");
    if (
      (a.includes(",") && (a = a.replace(/\./g, "").replace(",", ".")),
      !/^\d+(\.\d{1,2})?$/.test(a))
    )
      throw Error("Use um valor positivo com at\xE9 dois centavos.");
    let t = Math.round(Number(a) * 100);
    if (!Number.isSafeInteger(t) || t > 1e12)
      throw Error("Valor fora do limite.");
    return t;
  }
  function gl(e, a) {
    let [t, l, o] = e.split("-").map(Number),
      u = new Date(t, l - 1 + a, 1, 12),
      i = new Date(u.getFullYear(), u.getMonth() + 1, 0).getDate();
    return `${u.getFullYear()}-${String(u.getMonth() + 1).padStart(2, "0")}-${String(Math.min(o, i)).padStart(2, "0")}`;
  }
  function yr(e, a = Ve()) {
    let t = new Date(a + "T12:00:00"),
      l,
      o,
      u = (i) =>
        `${i.getFullYear()}-${String(i.getMonth() + 1).padStart(2, "0")}-${String(i.getDate()).padStart(2, "0")}`;
    return (
      e === "day"
        ? ((l = new Date(t)), (o = new Date(t)), o.setDate(o.getDate() + 1))
        : e === "week"
          ? ((l = new Date(t)),
            l.setDate(l.getDate() - ((l.getDay() + 6) % 7)),
            (o = new Date(l)),
            o.setDate(o.getDate() + 7))
          : e === "year"
            ? ((l = new Date(t.getFullYear(), 0, 1)),
              (o = new Date(t.getFullYear() + 1, 0, 1)))
            : ((l = new Date(t.getFullYear(), t.getMonth(), 1)),
              (o = new Date(t.getFullYear(), t.getMonth() + 1, 1))),
      [u(l), u(o)]
    );
  }
  var nu = (e, a) => e >= a[0] && e < a[1];
  function Wl(e) {
    if (typeof e != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e)) return !1;
    let a = new Date(e + "T12:00:00");
    return (
      !Number.isNaN(a.getTime()) &&
      `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, "0")}-${String(a.getDate()).padStart(2, "0")}` ===
        e
    );
  }
  function Ba(e) {
    let { total: a, count: t, start: l, payments: o = [] } = e;
    if (
      !Number.isSafeInteger(a) ||
      a <= 0 ||
      !Number.isInteger(t) ||
      t < 1 ||
      t > 600
    )
      throw Error("Parcelamento inv\xE1lido.");
    if (!Wl(l) || !Array.isArray(o))
      throw Error("Data ou hist\xF3rico do parcelamento inv\xE1lido.");
    let u = [],
      i = a,
      d = 0,
      s = Math.floor(a / t),
      c = Array.from({ length: t }, (C, m) => s + (m < a % t ? 1 : 0)),
      h = 0;
    for (; h < t || (i > 0 && h < o.length + 1);) {
      let C = h >= t,
        m = C ? 0 : c[h],
        b = Math.min(i, Math.max(0, m + d)),
        D = o[h];
      if (
        D &&
        (!Number.isSafeInteger(D.amount) || D.amount < 0 || D.amount > i)
      )
        throw Error("Pagamento superior ao saldo ou inv\xE1lido.");
      if (C && !D && i === 0) break;
      let E = D?.amount ?? 0,
        Z = !!D || b === 0,
        g = Z ? (C ? b - E : m + d - E) : 0;
      if (
        (u.push({
          index: h,
          number: h + 1,
          extra: C,
          base: m,
          due: b,
          paid: E,
          carry: g,
          adjustment: d,
          date: gl(l, h),
          closed: Z,
          payment: D,
        }),
        (i -= E),
        Z ? (d = C ? i : g) : (d = 0),
        h++,
        h > o.length + t + 1)
      )
        break;
    }
    return {
      rows: u,
      paid: a - i,
      remaining: i,
      progress: (a - i) / a,
      current: u.find((C) => !C.closed),
    };
  }
  function Sr(e, a) {
    return (
      (e.accounts.find((t) => t.id === a)?.initial || 0) +
      e.entries.reduce(
        (t, l) =>
          t +
          (l.accountId === a
            ? l.type === "income"
              ? l.amount
              : -l.amount
            : 0) +
          (l.type === "transfer" && l.toAccountId === a ? l.amount : 0),
        0,
      )
    );
  }
  var za = (e) => (e.contributions || []).reduce((a, t) => a + t.amount, 0);
  function Cr(e, a, t) {
    let l = e.goals
        .filter((u) => u.id !== t)
        .reduce(
          (u, i) =>
            u +
            (i.contributions || [])
              .filter((d) => d.accountId === a)
              .reduce((d, s) => d + s.amount, 0),
          0,
        ),
      o = (e.reserve || [])
        .filter((u) => u.accountId === a)
        .reduce((u, i) => u + i.amount, 0);
    return Sr(e, a) - l - o;
  }
  function vf(e, a) {
    let t = e.entries.filter((l) => !a || nu(l.date, a));
    return {
      balance: e.accounts.reduce((l, o) => l + Sr(e, o.id), 0),
      income: t
        .filter((l) => l.type === "income")
        .reduce((l, o) => l + o.amount, 0),
      expense: t
        .filter((l) => l.type === "expense")
        .reduce((l, o) => l + o.amount, 0),
      reserved: (e.reserve || []).reduce((l, o) => l + o.amount, 0),
      goals: e.goals.reduce((l, o) => l + za(o), 0),
    };
  }
  function Ir(e, a) {
    let t = e.sections.find((l) => l.id === a);
    if (!t) throw Error("Se\xE7\xE3o n\xE3o encontrada.");
    return {
      version: 1,
      title: t.title,
      kind: t.kind,
      total: t.total || 0,
      count: t.count || 0,
      start: t.start || "",
      updatedAt: new Date().toISOString(),
      payments: (t.payments || []).map((l) => ({
        amount: l.amount,
        date: l.date,
      })),
      entries: e.entries
        .filter((l) => l.sectionId === a && !l.paymentId)
        .map((l) => ({
          title: l.title,
          type: l.type,
          amount: l.amount,
          date: l.date,
        })),
    };
  }
  var iu = {
    theme: "porcelana",
    showOnOpen: !1,
    motion: !0,
    transition: !0,
    reveal: !0,
    numbers: !0,
    progress: !0,
    feedback: !0,
    glow: !1,
    haptic: !0,
    glass: !0,
    texture: !1,
    compact: !1,
    nav: "capsule",
    footerBlur: !0,
    blurStrength: 16,
    menuStyle: "popover",
    switchStyle: "soft",
    buttonStyle: "solid",
    cardStyle: "theme",
    calendarStyle: "classic",
    iconStyle: "outline",
    swipeActions: !0,
    focusMode: !1,
    heroImage: "",
    appName: "Marks",
    appIcon: "",
    appIconX: 50,
    appIconY: 50,
    chart: "auto",
    intensity: 1,
    notifications: !0,
    components: {
      consistency: !0,
      trend: !0,
      platforms: !0,
      goals: !0,
      sections: !0,
      agenda: !0,
      activity: !0,
      reserve: !0,
    },
  };
  function du() {
    return {
      version: 1,
      accounts: [],
      entries: [],
      sections: [],
      goals: [],
      deliveries: [],
      platforms: ["iFood entregador", "99 Food", "Keeta entregador", "Uber", "inDrive"],
      recurring: [],
      reserve: [],
      settings: normalizePersonalizationSettings(structuredClone(iu)),
      sharing: { url: "", key: "", grants: {} },
    };
  }
  function $l(e) {
    if (!e || e.version !== 1) throw Error("Backup incompat\xEDvel.");
    for (let o of [
      "accounts",
      "entries",
      "sections",
      "goals",
      "deliveries",
      "platforms",
      "recurring",
      "reserve",
    ])
      if (!Array.isArray(e[o]) || e[o].length > 5e4)
        throw Error("Backup inv\xE1lido: " + o);
    let a = (o) => Number.isSafeInteger(o) && Math.abs(o) <= 1e12;
    for (let o of e.accounts)
      if (!o.id || typeof o.title != "string" || !a(o.initial) || o.initial < 0)
        throw Error("Conta inv\xE1lida.");
    let t = new Set(e.accounts.map((o) => o.id));
    for (let o of [
      "accounts",
      "entries",
      "sections",
      "goals",
      "deliveries",
      "recurring",
    ])
      if (new Set(e[o].map((u) => u.id)).size !== e[o].length)
        throw Error("Identificadores duplicados no backup.");
    for (let o of e.entries)
      if (typeof o.title != "string" || !Wl(o.date))
        throw Error("T\xEDtulo ou data do lan\xE7amento inv\xE1lido.");
    for (let o of e.sections)
      if (
        typeof o.title != "string" ||
        !["receive", "pay", "ledger"].includes(o.kind) ||
        !Array.isArray(o.payments) ||
        o.payments.some((u) => !Wl(u.date))
      )
        throw Error("Se\xE7\xE3o inv\xE1lida.");
    for (let o of e.goals)
      if (
        !Wl(o.due) ||
        !Array.isArray(o.contributions) ||
        o.contributions.some((u) => !Wl(u.date))
      )
        throw Error("Data da meta inv\xE1lida.");
    for (let o of e.deliveries)
      if (!Wl(o.date)) throw Error("Data da entrega inv\xE1lida.");
    for (let o of e.entries)
      if (
        !a(o.amount) ||
        o.amount <= 0 ||
        !t.has(o.accountId) ||
        !["income", "expense", "transfer"].includes(o.type) ||
        !/\d{4}-\d{2}-\d{2}/.test(o.date) ||
        (o.type === "transfer" &&
          (!t.has(o.toAccountId) || o.toAccountId === o.accountId))
      )
        throw Error("Lan\xE7amento inv\xE1lido.");
    for (let o of e.sections) o.kind !== "ledger" && Ba(o);
    for (let o of e.goals)
      if (
        !a(o.target) ||
        o.target <= 0 ||
        typeof o.title != "string" ||
        !Array.isArray(o.contributions) ||
        o.contributions.some((u) => !a(u.amount) || !t.has(u.accountId)) ||
        za(o) < 0
      )
        throw Error("Meta inv\xE1lida.");
    for (let o of e.reserve)
      if (!a(o.amount) || o.amount < 0 || !t.has(o.accountId))
        throw Error("Reserva inv\xE1lida.");
    for (let o of e.goals)
      for (let u of e.accounts)
        if (
          o.contributions
            .filter((i) => i.accountId === u.id)
            .reduce((i, d) => i + d.amount, 0) < 0
        )
          throw Error("Resgate inv\xE1lido na meta.");
    for (let o of e.deliveries)
      if (
        !o.id ||
        typeof o.title != "string" ||
        typeof o.platform != "string" ||
        !a(o.amount) ||
        o.amount <= 0 ||
        !a(o.cost) ||
        o.cost < 0 ||
        typeof o.km != "number" ||
        !Number.isFinite(o.km) ||
        o.km < 0
      )
        throw Error("Entrega inv\xE1lida.");
    for (let o of e.recurring)
      if (
        !o.id ||
        typeof o.title != "string" ||
        !a(o.amount) ||
        o.amount <= 0 ||
        !t.has(o.accountId) ||
        !Number.isInteger(o.day) ||
        o.day < 1 ||
        o.day > 31 ||
        !["income", "expense"].includes(o.type)
      )
        throw Error("Recorr\xEAncia inv\xE1lida.");
    if (e.platforms.some((o) => typeof o != "string" || !o.trim()))
      throw Error("Plataforma inv\xE1lida.");
    for (let o of e.accounts)
      if (Cr(e, o.id) < 0)
        throw Error(
          "A conta " + o.title + " tem reservas e metas acima do saldo.",
        );
    e.settings = {
      ...structuredClone(iu),
      ...e.settings,
      components: { ...iu.components, ...e.settings?.components },
    };
    let l = e.sharing && typeof e.sharing == "object" ? e.sharing : {};
    e.sharing = {
      url: typeof l.url == "string" ? l.url : "",
      key: typeof l.key == "string" ? l.key : "",
      grants:
        l.grants && typeof l.grants == "object" && !Array.isArray(l.grants)
          ? l.grants
          : {},
    };
    for (let [o, u] of Object.entries(e.sharing.grants))
      if (
        !u ||
        typeof u.id != "string" ||
        typeof u.readKey != "string" ||
        typeof u.writeKey != "string" ||
        !e.sections.some((i) => i.id === o)
      )
        throw Error("Publica\xE7\xE3o inv\xE1lida no backup.");
    for (let o of e.goals)
      if (o.extensions === void 0) o.extensions = [];
      else if (!Array.isArray(o.extensions))
        throw Error("Hist\xF3rico da meta inv\xE1lido.");
    return (normalizeTrash(e), xf(e.settings), e.settings = normalizePersonalizationSettings(e.settings), validateReserveMetadata(e), validateDeliveryMetadata(e), e);
  }
  function bf() {
    let e = du(),
      a = Ve(),
      t = a.slice(0, 7);
    ((e.accounts = [
      { id: "bradesco", title: "Bradesco", initial: 48e4, color: "#d84154" },
      { id: "nubank", title: "Nubank", initial: 15e4, color: "#8456d9" },
    ]),
      (e.entries = [
        {
          id: ee(),
          title: "Sal\xE1rio",
          type: "income",
          amount: 32e4,
          date: t + "-05",
          accountId: "bradesco",
          category: "Sal\xE1rio",
        },
        {
          id: ee(),
          title: "Mercado da semana",
          type: "expense",
          amount: 28640,
          date: a,
          accountId: "nubank",
          category: "Alimenta\xE7\xE3o",
        },
        {
          id: ee(),
          title: "Internet",
          type: "expense",
          amount: 9990,
          date: t + "-03",
          accountId: "bradesco",
          category: "Casa",
        },
      ]),
      (e.sections = [
        {
          id: "console",
          title: "Venda do videogame",
          person: "Rafael",
          kind: "receive",
          total: 1e5,
          count: 10,
          start: t + "-10",
          payments: [{ id: ee(), amount: 8e3, date: a, accountId: "bradesco" }],
          privateNote: "",
        },
        {
          id: "emprestimo",
          title: "Empr\xE9stimo pessoal",
          person: "Marina",
          kind: "pay",
          total: 2e5,
          count: 5,
          start: t + "-20",
          payments: [],
        },
      ]),
      e.entries.push({
        id: ee(),
        title: "Venda do videogame \u2022 parcela 1",
        type: "income",
        amount: 8e3,
        date: a,
        accountId: "bradesco",
        sectionId: "console",
        paymentId: e.sections[0].payments[0].id,
        category: "Parcelas",
      }),
      (e.goals = [
        {id:"notebook",title:"Meu próximo notebook",target:100000,due:gl(a,5),priority:"Alta",pinned:true,statusLabel:"Concluída",link:"",image:"",contributions:[{id:ee(),accountId:"bradesco",amount:100000,date:a}],extensions:[]},
        {id:"viagem",title:"Viagem",target:100000,due:gl(a,8),priority:"Normal",pinned:true,statusLabel:"Em andamento",link:"",image:"",contributions:[{id:ee(),accountId:"bradesco",amount:50000,date:a}],extensions:[]},
        {id:"curso",title:"Curso",target:100000,due:gl(a,10),priority:"Baixa",pinned:true,statusLabel:"Em andamento",link:"",image:"",contributions:[{id:ee(),accountId:"bradesco",amount:2000,date:a}],extensions:[]},
      ]),
      (e.reserve = [{ id: ee(), accountId: "nubank", amount: 7e4 }]));
    for (let l = 0; l < 8; l++) {
      let o = new Date(a + "T12:00:00");
      o.setDate(o.getDate() - l);
      let u = `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, "0")}-${String(o.getDate()).padStart(2, "0")}`,
        i = ee(),
        d = 1800 + l * 350;
      (e.deliveries.push({
        id: i,
        platform: e.platforms[l % 3],
        title: ["Sabor da Vila", "Pizza Central", "Caf\xE9 da Pra\xE7a"][l % 3],
        pickup: "Rua das Flores, 120",
        destination: "",
        amount: d,
        km: 4 + l * 0.4,
        cost: 300,
        date: u,
      }),
        e.entries.push(
          {
            id: ee(),
            deliveryId: i,
            title: "Entrega \u2022 " + e.platforms[l % 3],
            type: "income",
            amount: d,
            date: u,
            accountId: "bradesco",
            category: "Entregas",
          },
          {
            id: ee(),
            deliveryId: i,
            title: "Custo da entrega",
            type: "expense",
            amount: 300,
            date: u,
            accountId: "bradesco",
            category: "Trabalho",
          },
        ));
    }
    e.recurring = [
      {
        id: ee(),
        title: "Internet",
        type: "expense",
        amount: 9990,
        day: 3,
        accountId: "bradesco",
        category: "Casa",
        active: !0,
      },
      {
        id: ee(),
        title: "Sal\xE1rio",
        type: "income",
        amount: 32e4,
        day: 5,
        accountId: "bradesco",
        category: "Sal\xE1rio",
        active: !0,
      },
    ];
    for (let l of e.recurring) {
      let o = e.entries.find((u) => u.title === l.title);
      o && ((o.recurringId = l.id), (o.competence = t));
    }
    return e;
  }
  function fn({ data: e, date: a, onSelect: t, scheduled = [] }) {
    let [l] = yr("week", a),
      o = Array.from({ length: 7 }, (i, d) => {
        let s = new Date(l + "T12:00:00");
        s.setDate(s.getDate() + d);
        let c = `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, "0")}-${String(s.getDate()).padStart(2, "0")}`,
          h = e.deliveries.filter((m) => m.date === c).length,
          C = e.entries.filter((m) => m.date === c).length,
          planned = scheduled.filter((item) => item.date === c).length;
        return {
          iso: c,
          rides: h,
          moves: C,
          planned,
          label: s
            .toLocaleDateString("pt-BR", { weekday: "short" })
            .replace(".", ""),
          day: s.getDate(),
        };
      }),
      u = o.filter((i) => i.moves > 0 || i.rides > 0 || i.planned > 0).length;
    return ca.default.createElement(
      ca.default.Fragment,
      null,
      ca.default.createElement(
        "div",
        { className: "week-caption" },
        ca.default.createElement("strong", null, u, " de 7 dias"),
        ca.default.createElement(
          "small",
          null,
          "com atividade ou compromissos agendados",
        ),
      ),
      ca.default.createElement(
        "div",
        { className: "activity-week" },
        o.map((i) =>
          ca.default.createElement(
            "button",
            {
              key: i.iso,
              "aria-label": `${i.iso}: ${i.rides} entregas, ${i.moves} lançamentos e ${i.planned} compromissos agendados`,
              className: i.rides || i.moves || i.planned ? "has-activity" : "",
              onClick: () => t(i.iso),
            },
            ca.default.createElement("small", null, i.label),
            ca.default.createElement(
              "span",
              null,
              i.rides || i.moves || i.planned
                ? ca.default.createElement(Ze, { size: 19 })
                : i.day,
            ),
            ca.default.createElement(
              "small",
              null,
              i.planned
                ? i.planned + " prazo" + (i.planned > 1 ? "s" : "")
                : i.rides
                ? i.rides + " ent."
                : i.moves
                  ? i.moves + " mov."
                  : "\u2014",
            ),
          ),
        ),
      ),
    );
  }
  var qe = ReactCompat;
function cn(props){return React.createElement(FluidNavigation,props);}
  var Ue = ReactCompat;
  function wr({ label: e, enabled: a, onOpen: t, onDelete: l, children: o }) {
    let [u, i] = (0, Ue.useState)(!1),
      d = (0, Ue.useRef)(null),
      s = (0, Ue.useRef)(!1);
    return a
      ? Ue.default.createElement(
          "div",
          {
            className: "swipe-card " + (u ? "swipe-open" : ""),
            role: "group",
            "aria-label": "A\xE7\xF5es de " + e,
            tabIndex: 0,
            onKeyDown: (c) => {
              (c.key === "ArrowLeft" && (c.preventDefault(), i(!0)),
                (c.key === "ArrowRight" || c.key === "Escape") && i(!1));
            },
            onPointerDown: (c) => {
              ((d.current = { x: c.clientX, y: c.clientY }), (s.current = !1));
            },
            onPointerUp: (c) => {
              if (!d.current) return;
              let h = c.clientX - d.current.x,
                C = c.clientY - d.current.y;
              (Math.abs(h) > 48 &&
                Math.abs(h) > Math.abs(C) * 1.5 &&
                ((s.current = !0), i(h < 0)),
                (d.current = null));
            },
            onClickCapture: (c) => {
              s.current &&
                (c.preventDefault(), c.stopPropagation(), (s.current = !1));
            },
          },
          Ue.default.createElement(
            "div",
            {
              className: "swipe-actions",
              "aria-hidden": !u,
              inert: u ? void 0 : !0,
            },
            Ue.default.createElement(
              "button",
              { "aria-label": "Abrir " + e, onClick: t },
              Ue.default.createElement(Da, { size: 20 }),
              Ue.default.createElement("small", null, "Abrir"),
            ),
            Ue.default.createElement(
              LiquidDangerButton,
              {
                className: "swipe-delete",
                "aria-label": "Excluir " + e,
                onClick: l,
              },
              Ue.default.createElement(Ge, { size: 19 }),
              Ue.default.createElement("small", null, "Excluir"),
            ),
          ),
          Ue.default.createElement("div", { className: "swipe-content" }, o),
          Ue.default.createElement(
            "button",
            {
              className: "swipe-handle",
              "aria-label": (u ? "Fechar" : "Mostrar") + " a\xE7\xF5es",
              "aria-expanded": u,
              onClick: () => i((c) => !c),
            },
            Ue.default.createElement(et, { size: 15 }),
          ),
        )
      : o;
  }
  var r = ReactCompat,
    Pg = ReactDOM;
  var Go = themeDomain.themes,
    qg = (id, systemDark) => resolveAppleTheme(id, systemDark) || Go.find((theme) => theme.id === id) || resolveAppleTheme('apple-system', systemDark);
  function Ug() {
    try {
      let e = window.NexoNative
        ? window.NexoNative.load()
        : localStorage.getItem("nexo-v1");
      if(!e)return du();
      const loaded=$l(JSON.parse(e));Ng(loaded);return loaded;
    } catch (e) {
      return ((window.nexoLoadError = e.message), null);
    }
  }
  function Ng(e) {
    let a = JSON.stringify(e);
    if (window.NexoNative) {
      if (!window.NexoNative.save(a))
        throw Error("N\xE3o foi poss\xEDvel salvar no aparelho.");
    } else localStorage.setItem("nexo-v1", a);
  }
  async function Us(e) {
    let a = JSON.stringify(e, null, 2);
    if (window.NexoNative) {
      window.NexoNative.exportBackup(a);
      return;
    }
    let t = URL.createObjectURL(new Blob([a], { type: "application/json" })),
      l = document.createElement("a");
    ((l.href = t),
      (l.download = "Marks-backup.json"),
      l.click(),
      setTimeout(() => URL.revokeObjectURL(t), 1e3));
  }
  async function Ns(e, a) {
    let { url: t, key: l, grants: o } = e.sharing;
    if (!o[a] || o[a].provider === 'firebase') return publishFirebaseSection(e,a);
    if (!t || !l)
      throw Error("Configure o servidor de compartilhamento primeiro.");
    if (!/^https:\/\/[^\s]+$/.test(t)) throw Error("Use um endere\xE7o HTTPS.");
    let u = o[a],
      i = new AbortController(),
      d = setTimeout(() => i.abort(), 15e3),
      s;
    try {
      s = await fetch(
        t.replace(/\/$/, "") + (u ? "/api/shares/" + u.id : "/api/shares"),
        {
          signal: i.signal,
          method: u ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...(u ? { "X-Write-Key": u.writeKey } : { "X-Owner-Key": l }),
          },
          body: JSON.stringify({ section: Ir(e, a), expiresDays: 30 }),
        },
      );
    } catch {
      throw Error(
        "N\xE3o foi poss\xEDvel alcan\xE7ar o servidor. Verifique sua conex\xE3o e tente publicar novamente.",
      );
    } finally {
      clearTimeout(d);
    }
    let c = await s.json();
    if (!s.ok) throw Error(c.error || "N\xE3o foi poss\xEDvel publicar.");
    return { ...u, ...c, syncedAt: new Date().toISOString(), error: "" };
  }
  var A = ReactCompat;
  function pe({ label: e, children: a, onClick: t, ...l }) {
    return A.default.createElement(
      /excluir|remover/i.test(e || '') ? LiquidDangerButton : motion.button,
      { className: "icon-button", "aria-label": e, title: e, onClick: t ? event => setTimeout(()=>t(event),80) : undefined, whileHover: {scale:1.025}, whileTap: {scale:.97}, transition:{type:"spring",stiffness:360,damping:28}, ...l },
      a,
    );
  }
  function F({ children: e, onClick: a, variant: t = "", ...l }) {
    return A.default.createElement(
      "button",
      { className: "button " + t, onClick: a ? event => {const action=()=>a(event);window.matchMedia("(prefers-reduced-motion: reduce)").matches?action():setTimeout(action,90);} : undefined, ...l },
      e,
    );
  }
  function St({ icon: e = be, title: a, children: t, action: l, onAction: o }) {
    return A.default.createElement(
      "div",
      { className: "empty" },
      A.default.createElement(e, { size: 30 }),
      A.default.createElement("h3", null, a),
      A.default.createElement("p", null, t),
      l &&
        A.default.createElement(
          F,
          { onClick: o },
          A.default.createElement(be, { size: 18 }),
          l,
        ),
    );
  }
function Hs(props){return React.createElement(AnimatedMoney,props);}
  function Pl(props){return React.createElement(AnimatedProgressRing,props);}
function Gl(props){return React.createElement(MotionProgress,props);}
function Ye(props){return React.createElement(MotionToggle,props);}
function Wi(props){return React.createElement(ContinuousTabs,props);}
  function J({
    title: e,
    subtitle: a,
    action: t,
    onAction: l,
    children: o,
    className: u = "",
    icon: i,
  }) {
    return A.default.createElement(
      MotionCard,
      { className: "card " + u },
      e &&
        A.default.createElement(
          "div",
          { className: "card-heading" },
          A.default.createElement(
            "div",
            null,
            i && A.default.createElement(i, { size: 18 }),
            A.default.createElement(
              "div",
              null,
              A.default.createElement("h2", null, e),
              a && A.default.createElement("p", null, a),
            ),
          ),
          t &&
            A.default.createElement(
              "button",
              { className: "text-button", onClick: l },
              t,
              A.default.createElement(Pe, { size: 16 }),
            ),
        ),
      o,
    );
  }
function Hg(props){return React.createElement(AppModal,props);}
  function X({
    label: e,
    name: a,
    type: t = "text",
    required: l = !1,
    options: o,
    defaultValue: u = "",
    hint: i,
    ...d
  }) {
    return A.default.createElement(
      "label",
      { className: "field" },
      A.default.createElement(
        "span",
        null,
        e,
        l && A.default.createElement("span", { "aria-hidden": "true" }, " *"),
      ),
      o
        ? A.default.createElement(
            "select",
            {
              "aria-label": e,
              name: a,
              ...(d.value !== void 0 ? {} : { defaultValue: u }),
              required: l,
              ...d,
            },
            o.map((s) =>
              A.default.createElement(
                "option",
                { key: s.value, value: s.value },
                s.label,
              ),
            ),
          )
        : t === "textarea"
          ? A.default.createElement("textarea", {
              "aria-label": e,
              name: a,
              ...(d.value !== void 0 ? {} : { defaultValue: u }),
              required: l,
              ...d,
            })
          : A.default.createElement("input", {
              "aria-label": e,
              name: a,
              type: t,
              ...(d.value !== void 0 ? {} : { defaultValue: u }),
              required: l,
              ...d,
            }),
      i && A.default.createElement("small", null, i),
    );
  }
  function Fs(props) {
    return React.createElement(AnimatedFinanceChart, props);
  }
  function Ri({ entry: e, visible: a, onClick: t }) {
    let l = e.type === "income", expense = e.type === "expense", moved = e.type === "transfer";
    return A.default.createElement(
      "button",
      { className: "transaction row-button", onClick: t },
      A.default.createElement(
        "span",
        { className: "round-icon " + (l ? "positive" : expense ? "negative" : "neutral") },
        l
          ? A.default.createElement(dl, { size: 20 })
          : A.default.createElement(Da, { size: 20 }),
      ),
      A.default.createElement(
        "span",
        { className: "grow" },
        A.default.createElement("strong", null, e.title),
        A.default.createElement(
          "small",
          null,
          e.category || "Geral",
          " \xB7 ",
          fa(e.date),
        ),
      ),
      A.default.createElement(Hs, {
        value: expense || moved ? -e.amount : e.amount,
        visible: a,
        signed: true,
        className: l ? "positive-text" : expense || moved ? "negative-text" : "positive-text",
      }),
    );
  }
  function ve({ children: e }) {
    return A.default.createElement(
      "p",
      { className: "help" },
      A.default.createElement(Bt, { size: 16 }),
      A.default.createElement("span", null, e),
    );
  }
  function Ps() {
    let [e, a] = A.default.useState(0);
    return A.default.createElement(
      "div",
      { className: "motion-preview" },
      A.default.createElement(
        "button",
        {
          className: "morph-control morph-stage-" + e,
          "aria-label": "Testar morph de componentes",
          "aria-pressed": e > 0,
          onClick: () => a((t) => (t + 1) % 3),
        },
        A.default.createElement(
          "svg",
          {
            viewBox: "0 0 24 24",
            width: "26",
            height: "26",
            "aria-hidden": "true",
          },
          A.default.createElement("path", {
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.7",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            style: {
              d:
                e === 2
                  ? "path('M5 12 L10 17 M10 17 L20 7')"
                  : "path('M12 5 L12 19 M5 12 L19 12')",
            },
          }),
        ),
        A.default.createElement(
          "span",
          null,
          e === 1
            ? "Guardar um plano"
            : e === 2
              ? "Plano confirmado"
              : "Testar morph",
        ),
        e === 2 &&
          A.default.createElement(
            "small",
            null,
            "Forma, espa\xE7o e cor em uma transi\xE7\xE3o.",
          ),
      ),
      A.default.createElement(
        "small",
        null,
        "Toque para transformar c\xEDrculo, c\xE1psula e cart\xE3o.",
      ),
    );
  }
  var $i = Ug(),
    rv = {
      dashboard: "Vis\xE3o geral",
      sections: "Minhas se\xE7\xF5es",
      deliveries: "Entregas",
      goals: "Meus objetivos",
      accounts: "Contas e reserva",
      entries: "Lan\xE7amentos",
      recurring: "Recorr\xEAncias",
      agenda: "Minha agenda",
      settings: "Personalização",
      help: "Sobre o Marks",
    },
    Fg = [
      "Alimenta\xE7\xE3o",
      "Casa",
      "Transporte",
      "Sa\xFAde",
      "Lazer",
      "Trabalho",
      "Sal\xE1rio",
      "Entregas",
      "Parcelas",
      "Outros",
    ];
  function iv() {
    const systemDark = useSystemDark();
    const [entryLimit,setEntryLimit]=React.useState(50);
    const [entryKind, setEntryKind] = React.useState("all");
    const [entryAccount, setEntryAccount] = React.useState("all");
    let [e, a] = (0, r.useState)($i || du()),
      [t, l] = (0, r.useState)("dashboard"),
      [o, u] = (0, r.useState)($i ? null : { type: "loadError" }),
      [i, d] = (0, r.useState)(!1),
      [s, c] = (0, r.useState)($i?.settings.showOnOpen || !1),
      [h, C] = (0, r.useState)("month"),
      [m, b] = (0, r.useState)(Ve()),
      [D, E] = (0, r.useState)(""),
      [Z, g] = (0, r.useState)(null),
      [p, x] = (0, r.useState)(null),
      [I, T] = (0, r.useState)(""),
      [N, B] = (0, r.useState)(!1),
      [z, me] = (0, r.useState)(""),
      [j, ka] = (0, r.useState)(0),
      gr = (0, r.useRef)(!1),
      hr = (0, r.useRef)(!$i),
      Gs = (0, r.useRef)({}),
      en = (0, r.useRef)({}),
      Ja = (0, r.useRef)(e),
      agendaOrigin = (0, r.useRef)(null),
      screenHistory = (0, r.useRef)([]);
    Ja.current = e;
    let Vs = (0, r.useRef)(),
      O = p || e.settings,
      we = qg(O.theme, systemDark),
      Vo = yr(h, m),
      Te = vf(e, Vo),
      P = (n) => r.default.createElement(Hs, { value: n, visible: s }),
      Qe = (n) => {
        (E(n),
          clearTimeout(Vs.current),
          (Vs.current = setTimeout(() => E(""), 4500)));
      };
    r.default.useEffect(() => { document.title = `${O.appName || "Marks"} · Organização financeira`; }, [O.appName]);
    React.useEffect(()=>{const timer=setInterval(()=>{const next=structuredClone(Ja.current);const count=next.trash?.length||0;purgeExpired(next);if((next.trash?.length||0)!==count)le(data=>{data.trash=next.trash;});},60000);return()=>clearInterval(timer);},[]);
    React.useEffect(()=>setEntryLimit(50),[entryKind,entryAccount,z,h,m]);
    function ke(n) {
      if (n !== t && n !== 'agenda' && t !== 'agenda') {
        screenHistory.current.push({screen:t,section:Z,period:h,date:m,query:z,scrollY:window.scrollY});
        if (screenHistory.current.length > 30) screenHistory.current.shift();
      }
      if (n === 'agenda' && t !== 'agenda') {
        agendaOrigin.current = { screen:t, section:Z, period:h, date:m, query:z, scrollY:window.scrollY };
      } else if (n !== 'agenda') agendaOrigin.current = null;
      (l(n), g(null), d(!1), me(""), window.scrollTo(0, 0));
    }
    function backScreen() {
      if (o) { Aa(); return; }
      if (t === 'agenda') { toggleAgenda(); return; }
      const previous=screenHistory.current.pop();
      if (!previous) { if (t !== 'dashboard') ke('dashboard'); return; }
      agendaOrigin.current=null;
      l(previous.screen);g(previous.section);C(previous.period);b(previous.date);me(previous.query);d(false);
      requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(0,previous.scrollY)));
    }
    function toggleAgenda() {
      if (t !== 'agenda') { ke('agenda'); return; }
      const previous = agendaOrigin.current;
      if (!previous) { ke('dashboard'); return; }
      agendaOrigin.current = null;
      l(previous.screen); g(previous.section); C(previous.period); b(previous.date); me(previous.query); d(false);
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, previous.scrollY)));
    }
    function Aa() {
      (window.NexoNative?.clearDraft?.(), u(null));
    }
    function U(n, f = {}) {
      (T(""), u({ type: n, ...f }), d(!1));
    }
    function le(n, f, L = {}) {
      try {
        if (hr.current && o?.type !== "importConfirm")
          throw Error(
            "Restaure um backup antes de gravar novos dados. O arquivo original foi preservado.",
          );
        let y = Ja.current;
        if (L.replaceData && Object.keys(y.sharing.grants).length)
          throw Error(
            "Revogue os links ativos antes de substituir seus dados. Assim voc\xEA mant\xE9m o controle dos acessos.",
          );
        let v = structuredClone(y);
        n(v);
        normalizeTrash(v);
        if(o?.type==="delete"&&!L.replaceData)archiveDeleted(y,v,"Registro excluído");
        for (let [S, k] of Object.entries(en.current))
          if (!v.sections.some((q) => q.id === S) || v.sharing.url !== k)
            throw Error(
              "Aguarde a publica\xE7\xE3o terminar antes de remover a se\xE7\xE3o ou mudar o servidor.",
            );
        ($l(v),
          Ng(v),
          o?.type === "importConfirm" && (hr.current = !1),
          a(v),
          (Ja.current = v),
          v.goals.length > y.goals.length &&
            v.settings.notifications &&
            window.NexoNative?.requestNotifications());
        for (let S of v.sections)
          !v.sharing.grants[S.id] ||
            !y.sections.some((k) => k.id === S.id) ||
            (xr(y, S.id) !== xr(v, S.id) && an(S.id));
        return (f && Qe(f), O.haptic && window.NexoNative?.haptic(), !0);
      } catch (y) {
        return (T(y.message), Qe(y.message), !1);
      }
    }
    function xr(n, f) {
      let L = Ir(n, f);
      return (delete L.updatedAt, JSON.stringify(L));
    }
    function an(n) {
      Gs.current[n] = (Gs.current[n] || Promise.resolve())
        .catch(() => {})
        .then(async () => {
          let f = Ja.current,
            L = f.sharing.grants[n];
          if (!(!L || (!f.sharing.url && L.provider !== 'firebase') || hr.current))
            try {
              let y = await Ns(f, n);
              Ja.current.sharing.grants[n]?.id === L.id &&
                le((v) => {
                  v.sharing.grants[n] = y;
                });
            } catch {
              Ja.current.sharing.grants[n]?.id === L.id &&
                le((v) => {
                  v.sharing.grants[n].error =
                    "H\xE1 altera\xE7\xF5es aguardando publica\xE7\xE3o. Verifique sua conex\xE3o e atualize o link.";
                });
            }
        });
    }
    (0, r.useEffect)(() => {
      const receiveTheme = (event) => {
        // srcdoc location.origin is "null" even when its inherited origin is HTTPS.
        if (window.parent === window || event.source !== window.parent || event.origin !== window.origin || event.data?.type !== 'nexo-simulator-set-theme') return;
        if (!Go.some((theme) => theme.id === event.data.id)) return;
        le((data) => { data.settings.theme = event.data.id; });
        x(null);
      };
      window.addEventListener('message', receiveTheme);
      return () => window.removeEventListener('message', receiveTheme);
    }, []);
    ((0, r.useEffect)(() => {
      let n = () => {
        if (!document.hidden)
          for (let f of Object.keys(Ja.current.sharing.grants)) an(f);
      };
      return (
        n(),
        window.addEventListener("online", n),
        document.addEventListener("visibilitychange", n),
        () => {
          (window.removeEventListener("online", n),
            document.removeEventListener("visibilitychange", n));
        }
      );
    }, []),
      (0, r.useLayoutEffect)(() => {
        ((document.documentElement.dataset.theme = we.id),
          (document.documentElement.dataset.themeFamily = we.family || "custom"),
          (document.documentElement.dataset.material = we.pattern || "default"),
          document.documentElement.style.setProperty("--catalog-radius",`${we.radius || 26}px`),
          (document.documentElement.dataset.themeChoice = O.theme),
          (document.documentElement.style.colorScheme = we.dark ? "dark" : "light"),
          (document.documentElement.dataset.dark = String(we.dark)),
          window.parent.postMessage({type:'nexo-simulator-theme',id:O.theme},'*'),
          (document.documentElement.dataset.layout = we.layout),
          (document.documentElement.dataset.motion = O.motion ? "on" : "off"),
          (document.documentElement.dataset.glass = O.glass ? "on" : "off"),
          (document.documentElement.dataset.texture = O.texture ? "on" : "off"),
          (document.documentElement.dataset.compact = O.compact
            ? "on"
            : "off"));
        for (let n of [
          "menuStyle",
          "switchStyle",
          "buttonStyle",
          "cardStyle",
          "calendarStyle",
          "iconStyle",
          "motionStyle",
          "chartAnimation",
        ])
          document.documentElement.dataset[n] = O[n];
        for (let n of [
          "transition",
          "reveal",
          "numbers",
          "progress",
          "feedback",
          "glow",
        ])
          document.documentElement.dataset[n] = O[n] ? "on" : "off";
        (document.documentElement.style.setProperty(
          "--speed",
          `${Math.max(0.15, O.intensity) * 300}ms`,
        ),
          Object.entries({
            bg: we.bg,
            surface: we.surface,
            text: we.text,
            muted: we.muted,
            accent: we.accent,
            "accent-text": we.accentText,
            line: we.line,
            positive: we.positive,
            negative: we.negative,
            font: we.family === 'apple' ? systemFontStack : `'${we.font}',sans-serif`,
          }).forEach(([n, f]) =>
            document.documentElement.style.setProperty("--" + n, f),
          ),
          (document.querySelector('meta[name="theme-color"]').content = we.bg),
          window.NexoNative?.setSystemTheme(we.dark, we.bg));
      }, [O, we]),
      (0, r.useEffect)(() => {
        let n = (y) => {
            (saveEntryReceipt(y.detail),
              window.NexoNative?.clearDraft?.());
          },
          f = (y) => {
            try {
              let v = $l(JSON.parse(y.detail));
              U("importConfirm", { importData: v });
            } catch (v) {
              Qe("Backup inv\xE1lido: " + v.message);
            }
          },
          L = () => {
            o
              ? Aa()
              : i
                ? d(!1)
                : Z
                  ? g(null)
                  : t === "agenda"
                    ? toggleAgenda()
                    : t !== "dashboard"
                    ? backScreen()
                    : window.NexoNative?.finishApp();
          };
        if (
          (window.addEventListener("nexo-image", n),
          window.addEventListener("nexo-import", f),
          window.addEventListener("nexo-back", L),
          !gr.current && window.NexoNative)
        ) {
          gr.current = !0;
          try {
            let y = window.NexoNative.getDraft?.();
            y && u(JSON.parse(y));
          } catch {}
          window.NexoNative.ready?.();
        }
        return () => {
          (window.removeEventListener("nexo-image", n),
            window.removeEventListener("nexo-import", f),
            window.removeEventListener("nexo-back", L));
        };
      }, [o, i, Z, t]),
      (0, r.useEffect)(() => {
        if (!e.settings.notifications) return;
        let n = e.goals.filter((f) => f.due < Ve() && za(f) < f.target);
        n.length &&
          Qe(
            `${n.length} meta(s) passaram do prazo. Voc\xEA pode estender na tela de objetivos.`,
          );
      }, []),
      (0, r.useEffect)(() => {
        !window.NexoNative ||
          hr.current ||
          window.NexoNative.scheduleGoals(
            JSON.stringify(
              e.settings.notifications
                ? e.goals
                    .filter((n) => za(n) < n.target)
                    .map((n) => ({ id: n.id, title: n.title, date: n.due }))
                : [],
            ),
          );
      }, [e.goals, e.settings.notifications]));
    let Ha = e.deliveries.filter((n) => nu(n.date, Vo)),
      il = Ha.reduce((n, f) => n + f.amount, 0),
      _o = Ha.reduce((n, f) => n + f.cost, 0),
      Ct = Ha.reduce((n, f) => n + f.km, 0),
      Xo = e.goals.reduce((n, f) => n + za(f), 0),
      jo = e.goals.reduce((n, f) => n + f.target, 0),
      _s = e.sections
        .filter((n) => n.kind === "receive")
        .reduce((n, f) => n + Ba(f).remaining, 0),
      Xs = e.sections
        .filter((n) => n.kind === "pay")
        .reduce((n, f) => n + Ba(f).remaining, 0);
    function It(n, f) {
      U("delete", { kind: n, id: f });
    }
    async function Gg(n) {
      if (N) return;
      B(!0);
      let f = Ja.current,
        L = xr(f, n);
      en.current[n] = f.sharing.url;
      try {
        let y = await Ns(f, n),
          v = L !== xr(Ja.current, n);
        le((k) => {
          k.sharing.grants[n] = y;
        }, "Se\xE7\xE3o publicada. Link pronto.") &&
          (v && an(n), U("share", { id: n }));
      } catch (y) {
        Qe(y.message);
      } finally {
        (delete en.current[n], B(!1));
      }
    }
    async function Vg(n) {
      if (N) return;
      let f = e.sharing.grants[n];
      if (f) {
        B(!0);
        try {
          if (f.provider === 'firebase') await revokeFirebaseShare(f);
          else if (
            !(
              await fetch(
                e.sharing.url.replace(/\/$/, "") + "/api/shares/" + f.id,
                { method: "DELETE", headers: { "X-Write-Key": f.writeKey } },
              )
            ).ok
          )
            throw Error("N\xE3o foi poss\xEDvel revogar.");
          le((y) => {
            delete y.sharing.grants[n];
          }, "Link revogado.");
        } catch (L) {
          Qe(L.message);
        } finally {
          B(!1);
        }
      }
    }
    function ge(n) {
      x((f) => {
        let L = structuredClone(f || e.settings);
        return (n(L), L);
      });
    }
    function _g(n) {
      let f = e.sharing.grants[n];
      if (f?.provider === 'firebase') return f.url;
      return f
        ? e.sharing.url.replace(/\/$/, "") + "/s/" + f.id + "#" + f.readKey
        : "";
    }
    function Xg(n) {
      window.NexoNative
        ? window.NexoNative.share(n)
        : navigator.share
          ? navigator.share({ text: n }).catch(() => {})
          : navigator.clipboard?.writeText(n).then(() => Qe("Link copiado."));
    }
    let js = [
        { value: "", label: "Escolha a conta" },
        ...e.accounts.map((n) => ({ value: n.id, label: n.title })),
      ],
      Wa = (n = "Valor (R$)", f = "amount", L = "") =>
        r.default.createElement(X, {
          label: n,
          name: f,
          inputMode: "decimal",
          required: !0,
          defaultValue: L,
          placeholder: "0,00",
        }),
      nl = (n = "Data", f = "date", L = Ve()) =>
        r.default.createElement(X, {
          label: n,
          name: f,
          type: "date",
          required: !0,
          defaultValue: L,
        }),
      Vl = (n = "accountId", f = "Conta banc\xE1ria") =>
        r.default.createElement(X, {
          label: f,
          name: n,
          required: !0,
          options: js,
        }),
      Ma = () =>
        e.accounts.length
          ? !1
          : (U("account"),
            Qe("Cadastre primeiro a conta para este lan\xE7amento."),
            !0);
    function saveEntryReceipt(image) {
      const id=o?.entry?.id;
      if (!id) { u(value=>value?{...value,image}:value); return; }
      if (le(data=>{const entry=data.entries.find(item=>item.id===id);if(!entry)throw Error("Este lançamento já não está disponível.");entry.image=image;},image?"Comprovante anexado ao lançamento.":"Comprovante removido."))
        u(value=>value?.type==="entryDetail"&&value.entry.id===id?{...value,entry:{...value.entry,image}}:value);
    }
    function tn() {
      if (window.NexoNative) {
        let n = document.querySelector(".modal form"),
          f = {
            ...o,
            formData: n ? Object.fromEntries(new FormData(n)) : o.formData,
          };
        if (!window.NexoNative.stageDraft(JSON.stringify(f))) {
          Qe(
            "N\xE3o foi poss\xEDvel preservar o formul\xE1rio. Tente novamente.",
          );
          return;
        }
        window.NexoNative.pickImage();
      } else document.getElementById("image-file").click();
    }
    (0, r.useEffect)(() => {
      if (!o?.formData) return;
      let n = document.querySelector(".modal form");
      if (n)
        for (let [f, L] of Object.entries(o.formData)) {
          let y = n.elements.namedItem(f);
          y && y.type !== "file" && (y.value = L);
        }
    }, [o?.type, o?.image, o?.formData]);
    function jg(n) {
      (n.preventDefault(), T(""));
      let f = Object.fromEntries(new FormData(n.currentTarget));
      try {
        let L = !1,
          y = () => {
            let S = Rl(f.amount);
            if (S <= 0) throw Error("O valor deve ser maior que zero.");
            return S;
          },
          v = () => {
            let S = f.title?.trim();
            if (!S) throw Error("Escreva um t\xEDtulo.");
            return S;
          };
        switch (o.type) {
          case "account":
            L = le(
              (S) => addBank(S, bankFromForm(new FormData(n.currentTarget), Rl)),
              "Conta cadastrada.",
            );
            break;
          case "entry": {
            let S = y();
            if (f.type === "transfer" && f.accountId === f.toAccountId)
              throw Error("Escolha duas contas diferentes.");
            L = le(
              (k) =>
                k.entries.push({
                  id: ee(),
                  image: o.image || "",
                  title: v(),
                  type: f.type,
                  amount: S,
                  date: f.date,
                  accountId: f.accountId,
                  toAccountId: f.type === "transfer" ? f.toAccountId : void 0,
                  category: f.category,
                  sectionId: f.sectionId || void 0,
                }),
              "Lan\xE7amento salvo.",
            );
            break;
          }
          case "section": {
            let S = Number(f.count),
              k = f.kind,
              q = k === "ledger" ? 0 : y();
            if (k !== "ledger" && (!Number.isInteger(S) || S < 1 || S > 600))
              throw Error("Use de 1 a 600 parcelas.");
            L = le(
              (ne) =>
                ne.sections.push({
                  id: ee(),
                  title: v(),
                  person: f.person,
                  kind: k,
                  total: q,
                  count: k === "ledger" ? 0 : S,
                  start: f.date,
                  payments: [],
                  privateNote: f.privateNote,
                }),
              "Se\xE7\xE3o criada.",
            );
            break;
          }
          case "payment": {
            let S = e.sections.find(($) => $.id === o.id),
              k = Ba(S),
              q = Rl(f.amount);
            if (q > k.remaining)
              throw Error("O valor supera o saldo restante.");
            let ne = ee();
            L = le(($) => {
              let Qo = $.sections.find((nh) => nh.id === o.id),
                Ws = k.current.index;
              for (; Qo.payments.length < Ws;)
                Qo.payments.push({
                  id: ee(),
                  amount: 0,
                  date: f.date,
                  auto: !0,
                });
              (Qo.payments.push({
                id: ne,
                amount: q,
                date: f.date,
                accountId: f.accountId,
              }),
                q > 0 &&
                  $.entries.push({
                    id: ee(),
                    paymentId: ne,
                    image: o.image || "",
                    sectionId: S.id,
                    title: S.title + " \u2022 parcela " + (Ws + 1),
                    type: S.kind === "receive" ? "income" : "expense",
                    amount: q,
                    date: f.date,
                    accountId: f.accountId,
                    category: "Parcelas",
                  }));
            }, "Pagamento registrado e parcelas recalculadas.");
            break;
          }
          case "delivery": {
            let S = y(),
              k = f.km ? Number(f.km.replace(",", ".")) : 0,
              q = Rl(f.cost || "0");
            if (!Number.isFinite(k) || k < 0)
              throw Error("Informe a dist\xE2ncia real em km.");
            if (!f.platform.trim()) throw Error("Escolha uma plataforma.");
            let ne = ee();
            L = le(($) => {
              ($.deliveries.push({
                id: ne,
                platform: f.platform,
                receiptStatus: f.receiptStatus==='pending'?'pending':'received',
                title: v(),
                pickup: f.pickup.trim(),
                destination: f.destination.trim(),
                amount: S,
                km: k,
                cost: q,
                date: f.date,
              }),
                f.receiptStatus!=='pending' && $.entries.push({
                  id: ee(),
                  deliveryId: ne,
                  title: "Entrega \u2022 " + f.platform,
                  type: "income",
                  amount: S,
                  date: f.date,
                  accountId: f.accountId,
                  category: "Entregas",
                }),
                q > 0 &&
                  $.entries.push({
                    id: ee(),
                    deliveryId: ne,
                    title: "Custo da entrega",
                    type: "expense",
                    amount: q,
                    date: f.date,
                    accountId: f.accountId,
                    category: "Trabalho",
                  }));
            }, "Entrega salva. Ganhos atualizados.");
            break;
          }
          case "platform":
            L = le((S) => {
              let k = v();
              if (S.platforms.includes(k))
                throw Error("Essa plataforma j\xE1 existe.");
              S.platforms.push(k);
              if (f.platformIcon) (S.deliveryPlatformSettings ??= {})[k] = {mode:"manual", icon:f.platformIcon};
            }, "Plataforma adicionada.");
            break;
          case "goal": {
            let S = y();
            if (f.link && !/^https?:\/\//.test(f.link))
              throw Error("Use um link come\xE7ando por https:// ou http://.");
            L = le(
              (k) =>
                k.goals.push({
                  id: ee(),
                  title: v(),
                  target: S,
                  due: f.date,
                  deadlineLabel: f.deadlineLabel?.trim() || "Prazo",
                  statusLabel: f.statusLabel?.trim() || "Em andamento",
                  priority: f.priority || "Normal",
                  link: f.link,
                  image: o.image || "",
                  contributions: [],
                  extensions: [],
                }),
              "Meta criada.",
            );
            break;
          }
          case "contribution": {
            let S = y(),
              k = e.goals.find((ne) => ne.id === o.id);
            if (f.direction === "add" && S > Cr(e, f.accountId))
              throw Error("N\xE3o h\xE1 saldo livre suficiente nessa conta.");
            let q = k.contributions
              .filter((ne) => ne.accountId === f.accountId)
              .reduce((ne, $) => ne + $.amount, 0);
            if (f.direction === "remove" && S > q)
              throw Error("Resgate superior ao valor dessa meta na conta.");
            L = le(
              (ne) =>
                ne.goals
                  .find(($) => $.id === k.id)
                  .contributions.push({
                    id: ee(),
                    accountId: f.accountId,
                    amount: f.direction === "remove" ? -S : S,
                    date: f.date,
                  }),
              "Aloca\xE7\xE3o da meta atualizada.",
            );
            break;
          }
          case "extend":
            if (f.date <= Ve()) throw Error("Escolha uma data futura.");
            L = le((S) => {
              let k = S.goals.find((q) => q.id === o.id);
              (k.extensions.push({ from: k.due, to: f.date, date: Ve() }),
                (k.due = f.date));
            }, "Prazo estendido.");
            break;
          case "reserve": {
            L = le((k) => changeReserve(k, {
              accountId: f.accountId,
              type: f.direction,
              amount: Rl(f.amount),
              date: f.date,
              note: f.note || "",
            }), "Movimentação da reserva registrada.");
            break;
          }
          case "recurring": {
            let S = y(),
              k = Number(f.day);
            if (!Number.isInteger(k) || k < 1 || k > 31)
              throw Error("Use um dia entre 1 e 31.");
            L = le(
              (q) =>
                q.recurring.push({
                  id: ee(),
                  title: v(),
                  type: f.type,
                  amount: S,
                  day: k,
                  accountId: f.accountId,
                  category: f.category,
                  active: !0,
                }),
              "Recorr\xEAncia cadastrada.",
            );
            break;
          }
          case "sharingConfig": {
            let S = f.url.trim().replace(/\/$/, "");
            if (S && !/^https:\/\/[^\s/#?]+(?::\d+)?$/.test(S))
              throw Error(
                "Informe apenas a origem HTTPS do servidor, sem caminho.",
              );
            if (Object.keys(e.sharing.grants).length && S !== e.sharing.url)
              throw Error(
                "Revogue os links ativos antes de mudar de servidor.",
              );
            L = le((k) => {
              ((k.sharing.url = S), (k.sharing.key = f.key.trim()));
            }, "Compartilhamento configurado.");
            break;
          }
        }
        L && Aa();
      } catch (L) {
        T(L.message);
      }
    }
    function sa(n, f, L, y) {
      return r.default.createElement(
        "div",
        { className: "kpi" },
        r.default.createElement(
          "span",
          { className: "kpi-label" },
          L && r.default.createElement(L, { size: 16 }),
          n,
        ),
        r.default.createElement("strong", null, f),
        y && r.default.createElement("small", null, y),
      );
    }
    function ln() {
      return r.default.createElement(
        "div",
        { className: "period-controls" },
        r.default.createElement(Wi, {
          label: "Per\xEDodo de an\xE1lise",
          value: h,
          onChange: C,
          options: [
            { value: "day", label: "Dia" },
            { value: "week", label: "Semana" },
            { value: "month", label: "M\xEAs" },
            { value: "year", label: "Ano" },
          ],
        }),
        r.default.createElement(
          "label",
          { className: "date-filter" },
          r.default.createElement(Ra, { size: 16 }),
          r.default.createElement("input", {
            "aria-label": "Data de refer\xEAncia",
            type: "date",
            value: m,
            onChange: (n) => {
              n.target.value && b(n.target.value);
            },
          }),
        ),
      );
    }
    function Ys(n) {
      let f = za(n) / n.target,
        L = n.due < Ve() && f < 1;
      return r.default.createElement(
        wr,
        {
          key: n.id,
          label: n.title,
          enabled: O.swipeActions,
          onOpen: () => _l("goals", n.id),
          onDelete: () => It("goal", n.id),
        },
        r.default.createElement(
          "button",
          {
            className: "goal-item row-button",
            key: n.id,
            onClick: () => {
              (g(n.id), _l("goals", n.id));
            },
          },
          n.image && r.default.createElement("img", { src: n.image, alt: "" }),
          r.default.createElement(
            "div",
            { className: "goal-top" },
            r.default.createElement(
              "span",
              { className: "round-icon" },
              r.default.createElement(Pa, { size: 20 }),
            ),
            r.default.createElement(
              "div",
              { className: "grow" },
              r.default.createElement("strong", null, n.title),
              r.default.createElement(
                "small",
                null,
                (n.deadlineLabel || "Prazo") + ": " + fa(n.due) + " \xB7 " + (f >= 1 ? "Concluída" : n.statusLabel || "Em andamento"),
              ),
            ),
            r.default.createElement(Pe, { size: 18 }),
          ),
          r.default.createElement(
            "div",
            { className: "amount-pair" },
            React.createElement(AnimatedMoney,{value:za(n),visible:s,fromZero:true,signed:true,className:"positive-text"}),
            r.default.createElement(
              "small",
              null,
              "de ",
              s ? ye(n.target) : "\u2022\u2022\u2022\u2022",
            ),
          ),
          r.default.createElement(Gl, { value: f, label: n.title }),
          r.default.createElement(
            "div",
            { className: "amount-pair" },
            r.default.createElement(
              "small",
              null,
              L
                ? "Estender prazo"
                : f >= 1
                  ? "Meta conclu\xEDda"
                  : "Seu objetivo est\xE1 mais perto",
            ),
            r.default.createElement(
              "b",
              null,
              s ? Math.round(f * 100) + "%" : "\u2022\u2022%",
            ),
          ),
        ),
      );
    }
    function _l(n, f) {
      (ke(n), g(f));
    }
    function Qs(n) {
      let f = n.kind === "ledger" ? null : Ba(n);
      return r.default.createElement(
        wr,
        {
          key: n.id,
          label: n.title,
          enabled: O.swipeActions,
          onOpen: () => _l("sections", n.id),
          onDelete: () => It("section", n.id),
        },
        r.default.createElement(
          "button",
          {
            className: "section-item row-button",
            key: n.id,
            onClick: () => _l("sections", n.id),
          },
          r.default.createElement(
            "span",
            {
              className:
                "round-icon " + (n.kind === "pay" ? "negative" : "positive"),
            },
            n.kind === "pay"
              ? r.default.createElement(Da, { size: 20 })
              : r.default.createElement(ta, { size: 20 }),
          ),
          r.default.createElement(
            "div",
            { className: "grow" },
            r.default.createElement(
              "strong",
              null,
              n.title,
              n.pinned &&
                r.default.createElement(
                  "span",
                  { className: "badge" },
                  "Fixada",
                ),
            ),
            r.default.createElement(
              "small",
              null,
              n.kind === "ledger"
                ? "Se\xE7\xE3o livre"
                : n.kind === "receive"
                  ? "A receber"
                  : "A pagar",
              n.person ? " \xB7 " + n.person : "",
            ),
            f && r.default.createElement(Gl, { value: f.progress }),
          ),
          r.default.createElement(
            "span",
            null,
            f && P(f.remaining),
            r.default.createElement(Pe, { size: 17 }),
          ),
        ),
      );
    }
    function Yg() {
      let n = [],
        f = [],
        [L, y] = Vo,
        v = new Date(L + "T12:00:00"),
        S =
          h === "year"
            ? 12
            : h === "day"
              ? 1
              : h === "month"
                ? Math.ceil((new Date(y + "T12:00:00") - v) / 864e5 / 7)
                : h === "week"
                  ? 7
                  : 4;
      for (let k = 0; k < S; k++) {
        let q, ne;
        if (h === "year")
          ((q = gl(L, k)),
            (ne = gl(L, k + 1)),
            f.push(
              new Date(q + "T12:00:00").toLocaleDateString("pt-BR", {
                month: "short",
              }),
            ));
        else if (h === "day") (f.push("Total do dia"), (q = L), (ne = y));
        else {
          let $ = new Date(v);
          ($.setDate($.getDate() + k * (h === "month" ? 7 : 1)),
            (q = Js($)),
            $.setDate($.getDate() + (h === "month" ? 7 : 1)),
            (ne = Js($)),
            f.push(
              h === "month"
                ? `${k * 7 + 1}\u2013${Math.min((k + 1) * 7, new Date(y + "T00:00:00").getDate() === 1 ? new Date(new Date(y + "T12:00:00").getTime() - 864e5).getDate() : 31)}`
                : new Date(q + "T12:00:00").toLocaleDateString("pt-BR", {
                    weekday: "short",
                  }),
            ));
        }
        n.push(
          e.entries
            .filter(($) => $.type === "income" && $.date >= q && $.date < ne)
            .reduce(($, Qo) => $ + Qo.amount, 0),
        );
      }
      return r.default.createElement(
        J,
        {
          title: "Entradas no per\xEDodo",
          subtitle: "Receitas confirmadas em R$",
          action: "Extrato",
          onAction: () => ke("entries"),
        },
        r.default.createElement(
          "div",
          { className: "chart-total" },
          P(Te.income),
          r.default.createElement(
            "span",
            { className: "badge" },
            h === "day" ? "Agrupado por hor\xE1rio" : "Hist\xF3rico real",
          ),
        ),
        r.default.createElement(Fs, {
          values: n,
          labels: f,
          visible: s,
          kind: O.chart === "auto" ? we.chart : O.chart,
        }),
        r.default.createElement(
          "div",
          { className: "chart-summary" },
          r.default.createElement("span", null, "Sa\xEDdas ", P(Te.expense)),
          r.default.createElement(
            "span",
            null,
            "Resultado ",
            P(Te.income - Te.expense),
          ),
        ),
      );
    }
    function Zs() {
      let n = e.platforms
        .map((f) => ({
          name: f,
          value: Ha.filter((L) => L.platform === f).reduce(
            (L, y) => L + y.amount,
            0,
          ),
        }))
        .sort((f, L) => L.value - f.value);
      return r.default.createElement(
        J,
        {
          title: "Na rua, no controle",
          subtitle: `${Ha.length} entregas no per\xEDodo`,
          icon: Ta,
          action: "Abrir",
          onAction: () => ke("deliveries"),
        },
        r.default.createElement(
          "div",
          { className: "kpi-grid" },
          sa("Ganho l\xEDquido", P(il - _o), ou),
          sa(
            "Por km",
            Ct ? P(Math.round(Ha.filter(item=>item.km>0).reduce((sum,item)=>sum+item.amount,0)/Ct)) : "Sem distância",
            Wo,
            "Receita bruta / km",
          ),
        ),
        r.default.createElement(
          "div",
          { className: "platform-bars" },
          n
            .filter((f) => f.value > 0)
            .map((f, L) =>
              r.default.createElement(
                "div",
                { key: f.name },
                r.default.createElement(
                  "span",
                  null,
                  r.default.createElement("b", null, f.name),
                  P(f.value),
                ),
                r.default.createElement(
                  "div",
                  { className: "platform-track" },
                  r.default.createElement("i", {
                    style: {
                      width:
                        (f.value / Math.max(1, ...n.map((y) => y.value))) *
                          100 +
                        "%",
                      opacity: 1 - L * 0.12,
                    },
                  }),
                ),
              ),
            ),
        ),
        !Ha.length &&
          r.default.createElement(
            "p",
            { className: "muted" },
            "Registre uma entrega para comparar as plataformas.",
          ),
      );
    }
    function Yo(allScheduled = false) {
      let n = [];
      for (let f of e.sections.filter((L) => L.kind !== "ledger")) {
        let schedule = Ba(f), rows = allScheduled ? schedule.rows.filter(row => !row.closed && row.due > 0) : [schedule.current].filter(Boolean);
        for (let L of rows)
          n.push({
            id: allScheduled ? `${f.id}-${L.index}` : f.id,
            date: L.date,
            title: allScheduled ? `${f.title} · parcela ${L.number}` : f.title,
            amount: L.due,
            type: f.kind,
            open: () => _l("sections", f.id),
          });
      }
      for (let f of e.goals.filter((L) => za(L) < L.target))
        n.push({
          id: f.id,
          date: f.due,
          title: f.title,
          amount: f.target - za(f),
          type: "goal",
          open: () => _l("goals", f.id),
        });
      for (let f of e.recurring.filter((L) => L.active)) {
        let months = allScheduled ? [-1, 0, 1].map(offset => gl(m, offset).slice(0, 7)) : [m.slice(0, 7)];
        for (let month of months) {
        let L = Math.min(
            f.day,
            new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate(),
          ),
          y = month + "-" + String(L).padStart(2, "0");
        e.entries.some(
          (v) => v.recurringId === f.id && v.competence === month,
        ) ||
          n.push({
            id: f.id,
            date: y,
            title: f.title,
            amount: f.amount,
            type: f.type,
            open: () => ke("recurring"),
          });
        }
      }
      return n.sort((f, L) => f.date.localeCompare(L.date));
    }
    function Ks() {
      return r.default.createElement(
        J,
        {
          title: "No seu radar",
          subtitle: "Pr\xF3ximos compromissos e prazos",
          action: "Agenda",
          onAction: () => ke("agenda"),
        },
        r.default.createElement(
          "div",
          { className: "timeline" },
          Yo()
            .slice(0, 4)
            .map((n) =>
              r.default.createElement(
                "button",
                { key: n.id, className: "timeline-item", onClick: n.open },
                r.default.createElement("span", { className: "timeline-dot" }),
                r.default.createElement(
                  "span",
                  null,
                  r.default.createElement(
                    "small",
                    null,
                    fa(n.date),
                    n.date < Ve() ? " \xB7 Vencido" : "",
                  ),
                  r.default.createElement("strong", null, n.title),
                ),
                P(n.amount),
              ),
            ),
        ),
        !Yo().length &&
          r.default.createElement(
            "p",
            { className: "muted" },
            "Tudo tranquilo por aqui. Seus pr\xF3ximos prazos aparecer\xE3o nesta lista.",
          ),
      );
    }
    function Qg() {
      let n = we.hero,
        f = e.goals[0],
        L = "Saldo total nas contas",
        y = Te.balance,
        v = "Saldo real, incluindo valores já reservados.";
      return (
        n === "cashflow" &&
          ((L = "Resultado do per\xEDodo"),
          (y = Te.income - Te.expense),
          (v = "Receitas menos despesas confirmadas")),
        n === "delivery" &&
          ((L = "Seu trabalho em movimento"),
          (y = il - _o),
          (v = `${Ha.length} entregas \xB7 ${Ct.toFixed(1).replace(".", ",")} km`)),
        n === "expense" &&
          ((L = "Despesas do per\xEDodo"),
          (y = Te.expense),
          (v = "Acompanhe cada sa\xEDda, com clareza")),
        n === "agenda" &&
          ((L = "Compromissos a pagar"),
          (y = Xs),
          (v = Yo().length + " itens no seu radar")),
        n === "sections" &&
          ((L = "Saldo a receber"),
          (y = _s),
          (v = e.sections.length + " se\xE7\xF5es organizadas")),
        n === "goal" &&
          ((L = f ? f.title : "Espa\xE7o para seus pr\xF3ximos planos"),
          (y = Xo),
          (v = "Guardado nos seus objetivos")),
        r.default.createElement(
          MotionCard,
          {
            className: "hero hero-" + n + (O.heroImage ? " has-photo" : ""),
            style: O.heroImage
              ? {
                  backgroundImage: `linear-gradient(#101b2ddd,#101b2ddd),url("${O.heroImage}")`,
                }
              : void 0,
          },
          r.default.createElement(
            "div",
            { className: "hero-top" },
            r.default.createElement(
              "span",
              null,
              r.default.createElement("span", { className: "status-dot" }),
              " ",
              L,
            ),
            r.default.createElement(
              pe,
              {
                label: s ? "Ocultar valores" : "Mostrar valores",
                onClick: () => c((S) => !S),
              },
              s
                ? r.default.createElement(Ql, { size: 17 })
                : r.default.createElement(fl, { size: 17 }),
            ),
          ),
          r.default.createElement(
            "div",
            { className: "hero-main" },
            r.default.createElement(
              "div",
              null,
              r.default.createElement(
                "div",
                { className: "hero-amount", key: s + y },
                React.createElement(AnimatedMoney, {
                  value: ["expense", "agenda"].includes(n) ? -Math.abs(y) : y,
                  visible: s, signed: true, fromZero: true,
                  className: (["expense", "agenda"].includes(n) || y < 0) ? "negative-text" : "positive-text",
                }),
              ),
              r.default.createElement("p", null, v),
            ),
            n === "goal" &&
              r.default.createElement(
                Pl,
                { progress: jo ? Xo / jo : 0, size: 96 },
                s
                  ? r.default.createElement(Pa, { size: 29 })
                  : r.default.createElement(fl, { size: 25 }),
              ),
            n === "delivery" &&
              r.default.createElement(
                "div",
                { className: "hero-symbol" },
                r.default.createElement(Ta, { size: 56, strokeWidth: 1.2 }),
              ),
          ),
          r.default.createElement(
            "div",
            { className: "hero-bottom" },
            r.default.createElement(
              "span",
              null,
              n === "expense"
                ? "Receitas"
                : n === "goal"
                  ? "Falta para suas metas"
                  : "Livre de aloca\xE7\xF5es",
              r.default.createElement(
                "b",
                null,
                n === "goal"
                  ? P(Math.max(0, jo - Xo))
                  : React.createElement(AnimatedMoney, {
                      value: n === "expense" ? Te.income : Te.balance - Te.reserved - Te.goals,
                      visible: s, signed: true, fromZero: true,
                      className: (n === "expense" ? Te.income : Te.balance - Te.reserved - Te.goals) < 0 ? "negative-text" : "positive-text",
                    }),
              ),
            ),
            r.default.createElement(
              "button",
              {
                onClick: () => {
                  Ma() || U(n === "delivery" ? "delivery" : "entry");
                },
              },
              r.default.createElement(be, { size: 18 }),
              n === "delivery" ? "Nova entrega" : "Lan\xE7ar",
            ),
          ),
        )
      );
    }
    function Zg() {
      let n = {
        consistency: r.default.createElement(
          J,
          {
            title: "Sua semana em movimento",
            subtitle: "Atividade e compromissos, de segunda a domingo",
            icon: Ra,
          },
          r.default.createElement(fn, {
            data: e,
            date: m,
            scheduled: Yo(true),
            onSelect: (f) => {
              (b(f), ke("agenda"));
            },
          }),
        ),
        trend: Yg(),
        platforms: Zs(),
        goals: r.default.createElement(
          J,
          {
            title: "Metas",
            action: "Ver metas",
            onAction: () => ke("goals"),
          },
          e.goals.slice(0, 2).map(Ys),
          !e.goals.length &&
            r.default.createElement(
              St,
              {
                icon: Pa,
                title: "Nenhuma meta cadastrada",
                action: "Criar meta",
                onAction: () => U("goal"),
              },
              "Cadastre o valor e o prazo da sua meta.",
            ),
        ),
        sections: r.default.createElement(
          J,
          {
            title: "Se\xE7\xF5es",
            action: "Se\xE7\xF5es",
            onAction: () => ke("sections"),
          },
          e.sections.length > 0 && React.createElement(SectionOrganizer, {
            items:[...e.sections].sort((a,b)=>+!!b.pinned-+!!a.pinned).slice(0,3).map(section=>({
              id:section.id,name:section.title,pinned:!!section.pinned,icon:ta,
              type:section.kind==='receive'?'A receber':section.kind==='pay'?'A pagar':'Lançamentos',
              status:'',subtitle:section.person||'Controle pessoal',
              amount:section.kind==='ledger'?e.entries.filter(entry=>entry.sectionId===section.id).length+' registros':s?ye(Ba(section).remaining):'••••',
              progress:section.kind==='ledger'?undefined:Ba(section).progress,action:()=>_l('sections',section.id)
            })), grants:[],
            onPin:(id,pinned)=>le(data=>{data.sections.find(section=>section.id===id).pinned=pinned;},pinned?'Seção fixada.':'Seção desafixada.'),
            onShare:id=>U('share',{id})
          }),
          !e.sections.length &&
            r.default.createElement(
              St,
              {
                icon: ta,
                title: "Organize seus acordos",
                action: "Criar se\xE7\xE3o",
                onAction: () => U("section"),
              },
              "Vendas, empr\xE9stimos e outros controles individuais.",
            ),
        ),
        reserve: r.default.createElement(
          J,
          {
            title: "Reserva de emerg\xEAncia",
            subtitle: "Valores separados nas suas contas",
            icon: Et,
            action: "Gerenciar",
            onAction: () => ke("accounts"),
          },
          r.default.createElement(
            "div",
            { className: "reserve-value" },
            P(Te.reserved),
          ),
          r.default.createElement(
            "p",
            { className: "muted" },
            e.reserve.length
              ? e.reserve
                  .map(
                    (f) => e.accounts.find((L) => L.id === f.accountId)?.title,
                  )
                  .join(", ")
              : "Separe uma parte do saldo para imprevistos.",
          ),
        ),
        agenda: Ks(),
        activity: React.createElement(RecentActivity, {
          onOpenAll: () => ke("entries"),
          activities: [...e.entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map(entry => ({
            title: entry.title,
            desc: (entry.type === "income" ? "Receita" : entry.type === "expense" ? "Despesa" : "Transferência") + " · " + (e.accounts.find(account => account.id === entry.accountId)?.title || "Conta") + " · " + (s ? ye(entry.amount) : "••••"),
            time: fa(entry.date),
            icon: React.createElement(entry.type === "income" ? dl : entry.type === "expense" ? Da : pl, { size: 20 }),
            action: () => U("entryDetail", { entry }),
          })),
        }),
      };
      return r.default.createElement(
        r.default.Fragment,
        null,
        Qg(),
        React.createElement(FinanceShortcuts, {
          onNavigate: ke,
          onCreate: () => { Ma() || U("entry"); },
          onSearch: query => { ke("entries"); me(query); },
        }),
        React.createElement(DashboardOverview, {
          periodControl: ln(),
          groups: [
            { id: "flow", title: "Seu fluxo no período", kpis: [
              {label:"Entradas",value:s?"+"+ye(Te.income):"••••",tone:"positive",icon:React.createElement(dl,{size:18})},
              {label:"Saídas",value:s?"−"+ye(Te.expense):"••••",tone:"negative",icon:React.createElement(Da,{size:18})}
            ], actionLabel:"Abrir extrato",onAction:()=>ke("entries") },
            { id: "agreements", title: "Seus acordos", kpis: [
              {label:"A receber",value:s?"+"+ye(_s):"••••",tone:"positive",icon:React.createElement(ta,{size:18})},
              {label:"A pagar",value:s?"−"+ye(Xs):"••••",tone:"negative",icon:React.createElement(Ko,{size:18})}
            ],actionLabel:"Ver seções",onAction:()=>ke("sections") },
            { id:"balances", title:"Saldo real, sem somar metas futuras",kpis:[
              {label:"Patrimônio em contas",value:s?"+"+ye(Te.balance):"••••",tone:"positive",icon:React.createElement(Et,{size:18})},
              {label:"Na reserva",value:s?"+"+ye(Te.reserved):"••••",tone:"positive",icon:React.createElement(Et,{size:18})}
            ],actionLabel:"Organizar reserva",onAction:()=>ke("accounts") }
          ],
          taskData:{
            title:"Metas em movimento",progress:jo?Math.min(100,Math.round(Xo/jo*100)):0,hideProgress:!s,
            completedCount:e.goals.filter(goal=>za(goal)>=goal.target).length,totalCount:e.goals.length,
            priority:e.goals[0]?.priority||"Normal",status:e.goals[0]?.statusLabel||"Em andamento",assignees:[],
            subtasks:(e.goals.some(goal=>goal.pinned)?e.goals.filter(goal=>goal.pinned).slice(0,4):e.goals).map(goal=>({id:goal.id,title:goal.title+" · "+(s?ye(za(goal))+" de "+ye(goal.target):"••••"),completed:za(goal)>=goal.target,progress:za(goal)/goal.target,pinned:!!goal.pinned,onPin:()=>le(data=>{const item=data.goals.find(item=>item.id===goal.id);if(!item.pinned&&data.goals.filter(item=>item.pinned).length>=4)throw Error("Você pode fixar até 4 metas.");item.pinned=!item.pinned;}),priority:goal.priority||"Normal",status:za(goal)>=goal.target?"Concluída":goal.statusLabel||"Em andamento",onPriorityChange:value=>le(data=>{data.goals.find(item=>item.id===goal.id).priority=value;}),onStatusChange:value=>le(data=>{data.goals.find(item=>item.id===goal.id).statusLabel=value;}),action:()=>{if(za(goal)>=goal.target)_l("goals",goal.id);else Ma()||U("contribution",{id:goal.id});}}))
          },
          onCreateGoal:()=>U("goal")
        }),
        React.createElement(CashflowForecast,{balance:Te.balance,items:Yo(true),visible:s}),
        r.default.createElement(
          "div",
          { className: "dashboard-stack" },
          we.order
            .flatMap((f) => (f === "platforms" ? [f, "consistency"] : [f]))
            .filter(
              (f) =>
                O.components[f] !== !1 &&
                (!O.focusMode ||
                  ["platforms", "sections", "agenda"].includes(f)),
            )
            .map((f) =>
              r.default.createElement(
                "div",
                { className: "dashboard-module module-" + f, key: f, role: "region", "aria-label": ({goals:"Metas",activity:"Últimas movimentações",sections:"Seções",reserve:"Reserva de emergência",agenda:"Agenda",platforms:"Entregas",consistency:"Atividade da semana",trend:"Evolução financeira"})[f] || f },
                n[f],
              ),
            ),
        ),
        e.accounts.length === 0 &&
          r.default.createElement(
            F,
            { variant: "full", onClick: () => U("account") },
            r.default.createElement(lt, { size: 18 }),
            "Cadastrar minha primeira conta",
          ),
      );
    }
    function Kg() {
      let n = e.sections.find((y) => y.id === Z);
      if (!n)
        return r.default.createElement(
          r.default.Fragment,
          null,
          r.default.createElement(
            "div",
            { className: "page-intro" },
            r.default.createElement(
              "p",
              null,
              "Um espa\xE7o para cada acordo.",
              r.default.createElement("br", null),
              "Compartilhe apenas o que escolher.",
            ),
            r.default.createElement(
              pe,
              { label: "Criar se\xE7\xE3o", onClick: () => U("section") },
              r.default.createElement(be, null),
            ),
          ),
          r.default.createElement(X, {
            label: "Buscar se\xE7\xE3o",
            name: "search",
            value: z,
            onChange: (y) => me(y.target.value),
            placeholder: "T\xEDtulo ou pessoa",
          }),
          e.sections.length > 0 && React.createElement(SectionOrganizer, {
            items: e.sections.filter(section => (section.title + " " + section.person).toLowerCase().includes(z.toLowerCase())).map(section => ({
              id: section.id, name: section.title, pinned: !!section.pinned, icon: ta,
              type: section.kind === "receive" ? "A receber" : section.kind === "pay" ? "A pagar" : "Lançamentos livres",
              status: section.kind === "ledger" ? e.entries.filter(entry => entry.sectionId === section.id).length + " registros" : (s ? ye(Ba(section).remaining) : "••••") + " restantes",
              subtitle: section.person || "Controle pessoal",
              amount: section.kind === "ledger" ? e.entries.filter(entry => entry.sectionId === section.id).length + " registros" : (s ? ye(Ba(section).remaining) : "••••"),
              progress: section.kind === "ledger" ? undefined : Ba(section).progress,
              action: () => _l("sections", section.id),
            })),
            grants: e.sections.filter(section => !!e.sharing.grants[section.id]).map(section => ({ id: section.id, title: section.title, description: e.sharing.grants[section.id].error || "Link de leitura ativo · gerenciar acesso", error: !!e.sharing.grants[section.id].error })),
            onPin: (id, pinned) => le(data => { const section = data.sections.find(section => section.id === id); if (section) section.pinned = pinned; }, pinned ? "Seção fixada." : "Seção desafixada."),
            onShare: id => U("share", { id }),
          }),
          !e.sections.length &&
            r.default.createElement(
              St,
              {
                icon: ta,
                title: "Sua primeira se\xE7\xE3o",
                action: "Criar se\xE7\xE3o",
                onAction: () => U("section"),
              },
              "Acompanhe parcelas, valores emprestados ou um grupo de lan\xE7amentos.",
            ),
        );
      let f = n.kind === "ledger" ? null : Ba(n),
        L = e.sharing.grants[n.id];
      return r.default.createElement(
        r.default.Fragment,
        null,
        r.default.createElement(
          "div",
          { className: "detail-heading" },
          r.default.createElement(
            "button",
            { className: "text-button", onClick: () => g(null) },
            r.default.createElement($a, { size: 18 }),
            "Todas as se\xE7\xF5es",
          ),
          r.default.createElement(
            pe,
            {
              label: "Op\xE7\xF5es da se\xE7\xE3o",
              onClick: () => U("sectionMenu", { id: n.id }),
            },
            r.default.createElement(et, null),
          ),
        ),
        r.default.createElement("h1", { className: "detail-title" }, n.title),
        r.default.createElement(
          "p",
          { className: "muted" },
          n.person || "Controle pessoal",
          " \xB7",
          " ",
          n.kind === "receive"
            ? "A receber"
            : n.kind === "pay"
              ? "A pagar"
              : "Lan\xE7amentos livres",
        ),
        f &&
          r.default.createElement(
            J,
            null,
            r.default.createElement(
              "div",
              { className: "detail-progress" },
              r.default.createElement(
                "div",
                null,
                r.default.createElement("small", null, "Saldo restante"),
                r.default.createElement(
                  "div",
                  { className: "big-value" },
                  P(f.remaining),
                ),
                r.default.createElement(
                  "p",
                  null,
                  P(f.paid),
                  " de ",
                  s ? ye(n.total) : "\u2022\u2022\u2022\u2022",
                ),
              ),
              r.default.createElement(
                Pl,
                { progress: f.progress },
                s ? Math.round(f.progress * 100) + "%" : "\u2022\u2022",
              ),
            ),
            r.default.createElement(Gl, { value: f.progress }),
            r.default.createElement(
              F,
              {
                variant: "full",
                disabled: !f.current,
                onClick: () => {
                  Ma() || U("payment", { id: n.id });
                },
              },
              r.default.createElement(be, { size: 18 }),
              f.current ? "Registrar pagamento" : "Quitado",
            ),
          ),
        r.default.createElement(
          "div",
          { className: "share-strip" },
          r.default.createElement(tt, { size: 18 }),
          r.default.createElement(
            "div",
            null,
            r.default.createElement(
              "strong",
              null,
              L ? "Link publicado" : "Acesso exclusivo desta se\xE7\xE3o",
            ),
            r.default.createElement(
              "small",
              null,
              L
                ? L.error ||
                    "\xDAltima publica\xE7\xE3o: " +
                      new Date(L.syncedAt).toLocaleString("pt-BR")
                : "A pessoa acompanha somente este acordo.",
            ),
          ),
          r.default.createElement(
            pe,
            {
              label: "Compartilhar se\xE7\xE3o",
              onClick: () => U("share", { id: n.id }),
            },
            r.default.createElement(Zl, { size: 19 }),
          ),
        ),
        f &&
          r.default.createElement(
            r.default.Fragment,
            null,
            r.default.createElement(
              "div",
              { className: "section-label" },
              r.default.createElement("h2", null, "Cronograma"),
              r.default.createElement(
                "span",
                { className: "badge" },
                n.count,
                " previstas",
              ),
            ),
            r.default.createElement(
              "div",
              { className: "installments" },
              f.rows.map((y) =>
                r.default.createElement(
                  "div",
                  {
                    key: y.index,
                    className:
                      "installment " +
                      (y.extra ? "extra " : "") +
                      (y.closed ? "closed" : ""),
                  },
                  r.default.createElement(
                    "span",
                    { className: "installment-number" },
                    y.closed
                      ? r.default.createElement(Ze, { size: 17 })
                      : y.number,
                  ),
                  r.default.createElement(
                    "div",
                    { className: "grow" },
                    r.default.createElement(
                      "strong",
                      null,
                      "Parcela ",
                      y.number,
                      y.extra &&
                        r.default.createElement(
                          "span",
                          { className: "badge" },
                          "Extra",
                        ),
                    ),
                    r.default.createElement(
                      "small",
                      null,
                      fa(y.date),
                      y.closed
                        ? " \xB7 " + (y.paid >= y.due ? "Paga" : "Parcial")
                        : " \xB7 Prevista",
                    ),
                    y.adjustment !== 0 &&
                      r.default.createElement(
                        "button",
                        {
                          className: "adjustment",
                          onClick: () =>
                            U("info", {
                              title: "Ajuste desta parcela",
                              text: `Valor original: ${ye(y.base)}. ${y.adjustment > 0 ? "Faltaram" : "Foram antecipados"} ${ye(Math.abs(y.adjustment))} na parcela anterior. Valor atualizado: ${ye(y.due)}. O total do acordo n\xE3o muda.`,
                            }),
                        },
                        r.default.createElement(Bt, { size: 13 }),
                        " ",
                        y.adjustment > 0 ? "+" : "\u2212",
                        s ? ye(Math.abs(y.adjustment)) : "\u2022\u2022",
                        " de ajuste",
                      ),
                    y.closed &&
                      y.carry > 0 &&
                      r.default.createElement(
                        "small",
                        { className: "warning-text" },
                        s ? ye(y.carry) : "\u2022\u2022",
                        " seguem para a pr\xF3xima",
                      ),
                  ),
                  y.closed && y.payment && e.entries.some(entry=>entry.paymentId===y.payment.id) && React.createElement("button", {type:"button",className:"installment-receipt", "aria-label":"Comprovante da parcela "+y.number,onClick:()=>U("entryDetail",{entry:e.entries.find(entry=>entry.paymentId===y.payment.id)})},React.createElement(cl,{size:17}),e.entries.find(entry=>entry.paymentId===y.payment.id)?.image?"Ver comprovante":"Anexar comprovante"),
                  r.default.createElement(
                    "div",
                    { className: "installment-values" },
                    P(y.closed ? y.paid : y.due),
                    r.default.createElement(
                      "small",
                      null,
                      y.closed ? "registrado" : "a pagar",
                    ),
                  ),
                ),
              ),
            ),
            r.default.createElement(
              ve,
              null,
              "Um pagamento parcial fecha esta parcela e leva a diferen\xE7a para a pr\xF3xima. Se faltar na \xFAltima, surge uma parcela extra destacada. N\xE3o h\xE1 juros autom\xE1ticos.",
            ),
            n.payments.length > 0 &&
              r.default.createElement(
                F,
                {
                  variant: "secondary full",
                  onClick: () => U("undoPayment", { id: n.id }),
                },
                r.default.createElement(pl, { size: 17 }),
                "Estornar \xFAltimo pagamento",
              ),
          ),
        r.default.createElement(
          J,
          {
            title: "Lan\xE7amentos da se\xE7\xE3o",
            subtitle:
              n.kind === "ledger"
                ? void 0
                : "Para abater parcelas, use Registrar pagamento.",
            action: n.kind === "ledger" ? "Adicionar" : "Outro registro",
            onAction: () => {
              Ma() || U("entry", { sectionId: n.id });
            },
          },
          e.entries
            .filter((y) => y.sectionId === n.id)
            .map((y) =>
              r.default.createElement(Ri, {
                key: y.id,
                entry: y,
                visible: s,
                onClick: () => U("entryDetail", { entry: y }),
              }),
            ),
          !e.entries.some((y) => y.sectionId === n.id) &&
            r.default.createElement(
              "p",
              { className: "muted" },
              "Ainda sem lan\xE7amentos.",
            ),
        ),
      );
    }
    function Jg() {
      let n = e.goals.find((v) => v.id === Z);
      if (!n)
        return r.default.createElement(
          r.default.Fragment,
          null,
          r.default.createElement(
            "div",
            { className: "page-intro" },
            r.default.createElement(
              "p",
              null,
              "D\xEA um destino ao seu dinheiro.",
              r.default.createElement("br", null),
              "Cada aporte aproxima voc\xEA.",
            ),
            r.default.createElement(
              pe,
              { label: "Criar meta", onClick: () => U("goal") },
              r.default.createElement(be, null),
            ),
          ),
          e.goals.length > 0 && React.createElement(GoalProgress, { data: {
            title: "Metas e aportes", progress: jo ? Math.min(100, Math.round(Xo / jo * 100)) : 0, hideProgress: !s,
            completedCount: e.goals.filter(goal => za(goal) >= goal.target).length, totalCount: e.goals.length,
            priority: e.goals[0]?.priority || "Normal",
            status: e.goals[0]?.statusLabel || "Em andamento", assignees: [],
            subtasks: e.goals.map(goal => ({ id: goal.id, title: goal.title + " · " + (s ? ye(za(goal)) + " de " + ye(goal.target) : "••••"), completed: za(goal) >= goal.target, progress: za(goal)/goal.target, pinned: !!goal.pinned, onPin: () => le(data => {const item=data.goals.find(item=>item.id===goal.id);if(!item.pinned&&data.goals.filter(item=>item.pinned).length>=4)throw Error("Você pode fixar até 4 metas.");item.pinned=!item.pinned;}), priority: goal.priority || "Normal", status: za(goal)>=goal.target ? "Concluída" : goal.statusLabel || "Em andamento", onPriorityChange: value => le(data => { data.goals.find(item => item.id === goal.id).priority = value; }), onStatusChange: value => le(data => { data.goals.find(item => item.id === goal.id).statusLabel = value; }), action: () => { if (za(goal) >= goal.target) _l("goals", goal.id); else Ma() || U("contribution", { id: goal.id }); } })),
          } }),
          e.goals.map(Ys),
          !e.goals.length &&
            r.default.createElement(
              St,
              {
                icon: Pa,
                title: "O que voc\xEA quer conquistar?",
                action: "Criar meta",
                onAction: () => U("goal"),
              },
              "Adicione t\xEDtulo, imagem, link, valor e prazo.",
            ),
        );
      let f = za(n),
        L = f / n.target,
        y = n.due < Ve() && L < 1;
      return r.default.createElement(
        r.default.Fragment,
        null,
        r.default.createElement(
          "div",
          { className: "detail-heading" },
          r.default.createElement(
            "button",
            { className: "text-button", onClick: () => g(null) },
            r.default.createElement($a, { size: 18 }),
            "Todas as metas",
          ),
          r.default.createElement(
            pe,
            { label: "Excluir meta", onClick: () => It("goal", n.id) },
            r.default.createElement(Ge, { size: 19 }),
          ),
        ),
        n.image &&
          r.default.createElement("img", {
            className: "goal-cover",
            src: n.image,
            alt: n.title,
          }),
        r.default.createElement("h1", { className: "detail-title" }, n.title),
        n.link &&
          r.default.createElement(
            F,
            {
              variant: "secondary",
              onClick: () =>
                window.NexoNative
                  ? window.NexoNative.openExternal(n.link)
                  : window.open(n.link, "_blank", "noopener"),
            },
            r.default.createElement(Jo, { size: 17 }),
            "Ver o que quero comprar",
          ),
        r.default.createElement(
          J,
          null,
          r.default.createElement(
            "div",
            { className: "detail-progress" },
            r.default.createElement(
              "div",
              null,
              r.default.createElement("small", null, "Seu progresso"),
              r.default.createElement("div", { className: "big-value positive-text" }, React.createElement(AnimatedMoney,{value:f,visible:s,fromZero:true,signed:true,className:"positive-text"})),
              r.default.createElement("p", null, "Objetivo: ", P(n.target)),
            ),
            r.default.createElement(Pl, { progress: L }),
          ),
          r.default.createElement(Gl, { value: L }),
          r.default.createElement(
            "div",
            { className: "amount-pair" },
            r.default.createElement("span", null, "Previs\xE3o: ", fa(n.due)),
            r.default.createElement(
              "b",
              null,
              L >= 1
                ? "Conquistado!"
                : y
                  ? "Prazo encerrado"
                  : Math.max(
                      0,
                      Math.ceil(
                        (new Date(n.due + "T12:00:00") -
                          new Date(Ve() + "T12:00:00")) /
                          864e5,
                      ),
                    ) + " dias",
            ),
          ),
          r.default.createElement(
            F,
            {
              variant: "full",
              onClick: () => {
                Ma() || U("contribution", { id: n.id });
              },
            },
            r.default.createElement(be, { size: 18 }),
            "Adicionar ou resgatar valor",
          ),
          React.createElement(GoalTargetEditor,{key:n.id,target:n.target,deposited:f,parse:Rl,format:ye,onSave:value=>le(data=>{data.goals.find(goal=>goal.id===n.id).target=value;},"Valor da meta atualizado.")}),
          React.createElement(GoalMetaEditor,{key:n.id+"-meta",due:n.due,deadlineLabel:n.deadlineLabel,statusLabel:n.statusLabel,priority:n.priority,onSave:value=>le(data=>Object.assign(data.goals.find(goal=>goal.id===n.id),value),"Prazo e situação atualizados.")}),
          r.default.createElement(
            F,
            {
              variant: "secondary full",
              onClick: () => U("extend", { id: n.id }),
            },
            r.default.createElement(Ra, { size: 17 }),
            y ? "Estender prazo" : "Alterar prazo",
          ),
        ),
        y &&
          r.default.createElement(
            "div",
            { className: "notice" },
            r.default.createElement(sl, { size: 21 }),
            r.default.createElement(
              "div",
              null,
              r.default.createElement(
                "strong",
                null,
                "A data chegou. Seu plano continua.",
              ),
              r.default.createElement(
                "p",
                null,
                "Voc\xEA ainda pode ajustar o prazo e seguir juntando.",
              ),
            ),
          ),
        r.default.createElement(
          J,
          { title: "Onde est\xE1 guardado" },
          e.accounts.map((v) => {
            let S = n.contributions
              .filter((k) => k.accountId === v.id)
              .reduce((k, q) => k + q.amount, 0);
            return (
              S !== 0 &&
              r.default.createElement(
                "div",
                { className: "simple-row", key: v.id },
                r.default.createElement("span", null, v.title),
                r.default.createElement(Hs, { value: S, visible: s, signed: true, className: S < 0 ? "negative-text" : "positive-text" }),
              )
            );
          }),
        ),
        r.default.createElement(
          J,
          { title: "Hist\xF3rico de aportes" },
          [...n.contributions]
            .reverse()
            .map((v) =>
              r.default.createElement(
                "div",
                { className: "simple-row", key: v.id },
                r.default.createElement(
                  "div",
                  null,
                  r.default.createElement(
                    "strong",
                    null,
                    v.amount > 0 ? "Aporte" : "Resgate",
                  ),
                  r.default.createElement(
                    "small",
                    null,
                    e.accounts.find((S) => S.id === v.accountId)?.title,
                    " \xB7",
                    " ",
                    fa(v.date),
                  ),
                ),
                r.default.createElement(Hs, { value: v.amount, visible: s, signed: true, className: v.amount < 0 ? "negative-text" : "positive-text" }),
              ),
            ),
          !n.contributions.length &&
            r.default.createElement(
              "p",
              { className: "muted" },
              "A meta come\xE7a com o primeiro aporte.",
            ),
        ),
        r.default.createElement(
          ve,
          null,
          "O aporte separa dinheiro que j\xE1 est\xE1 na conta. Ele n\xE3o \xE9 uma nova despesa, e o saldo total n\xE3o aumenta.",
        ),
      );
    }
    function Wg() {return React.createElement(React.Fragment,null,ln(),React.createElement(DeliveryWorkspace,{data:e,rows:Ha,visible:s,parseAmount:Rl,onChange:le,onCreate:type=>{if(type!=="delivery"||!Ma())U(type);},onOpen:delivery=>U("deliveryDetail",{delivery})}));}

    function Rg() {
      return React.createElement(ReserveWorkspace, {
        data: e,
        format: value => s ? ye(value) : "••••",
        parse: Rl,
        balance: id => Sr(e, id),
        free: id => Cr(e, id),
        onDataChange: le,
        onCreateBank: () => U("account"),
        onDeleteBank: id => It("account", id),
      });
    }
    function $g() {
      const selectedAccount = e.accounts.some(account => account.id === entryAccount) ? entryAccount : "all";
      const visibleEntries = e.entries.filter(entry => nu(entry.date, Vo) &&
        (entryKind === "all" || entry.type === entryKind) &&
        (selectedAccount === "all" || entry.accountId === selectedAccount || entry.toAccountId === selectedAccount) &&
        [entry.title, entry.category, e.accounts.find(account => account.id === entry.accountId)?.title, e.accounts.find(account => account.id === entry.toAccountId)?.title].filter(Boolean).join(" ").toLowerCase().includes(z.toLowerCase())
      ).sort((a, b) => b.date.localeCompare(a.date));
      const chartEntries = e.entries.filter(entry => nu(entry.date, Vo) &&
        (selectedAccount === "all" || entry.accountId === selectedAccount || entry.toAccountId === selectedAccount) &&
        [entry.title, entry.category, e.accounts.find(account => account.id === entry.accountId)?.title, e.accounts.find(account => account.id === entry.toAccountId)?.title].filter(Boolean).join(" ").toLowerCase().includes(z.toLowerCase())
      );
      const incomeTotal = chartEntries.filter(entry => entry.type === "income").reduce((sum, entry) => sum + entry.amount, 0);
      const expenseTotal = chartEntries.filter(entry => entry.type === "expense").reduce((sum, entry) => sum + entry.amount, 0);
      return r.default.createElement(
        r.default.Fragment,
        null,
        ln(),
        r.default.createElement(
          "div",
          { className: "page-intro" },
          r.default.createElement(
            "p",
            null,
            "Entradas e sa\xEDdas, com contexto.",
          ),
          r.default.createElement(
            pe,
            {
              label: "Novo lan\xE7amento",
              onClick: () => {
                Ma() || U("entry");
              },
            },
            r.default.createElement(be, null),
          ),
        ),
        r.default.createElement(X, {
          label: "Buscar lan\xE7amento",
          name: "query",
          value: z,
          onChange: (n) => me(n.target.value),
          placeholder: "T\xEDtulo, categoria ou conta",
        }),
        React.createElement(EntryFilters, { accounts: e.accounts, kind: entryKind, account: e.accounts.some(account => account.id === entryAccount) ? entryAccount : "all", onKind: setEntryKind, onAccount: setEntryAccount }),
        r.default.createElement(J, { title: "Entradas e saídas" },
          r.default.createElement("div", { className: "entry-summary-totals" },
            r.default.createElement("div", null, r.default.createElement("small", null, "Entradas"), r.default.createElement("strong", {className:"positive-text"}, s ? "+"+ye(incomeTotal) : "••••")),
            r.default.createElement("div", null, r.default.createElement("small", null, "Saídas"), r.default.createElement("strong", {className:"negative-text"}, s ? "−"+ye(expenseTotal) : "••••")),
          ),
          r.default.createElement(Fs, { values:[incomeTotal,expenseTotal], labels:["Entradas","Saídas"], colors:["var(--positive)","var(--negative)"], kind:"bars", visible:s }),
        ),
        r.default.createElement(
          J,
          null,
          visibleEntries.slice(0,entryLimit)
            .map((n) =>
              r.default.createElement(Ri, {
                key: n.id,
                entry: n,
                visible: s,
                onClick: () => U("entryDetail", { entry: n }),
              }),
            ),
          visibleEntries.length>entryLimit&&React.createElement("button",{type:"button",className:"button secondary full",onClick:()=>setEntryLimit(limit=>limit+50)},"Mostrar mais 50 lançamentos"),
          !visibleEntries.length &&
            r.default.createElement(
              St,
              {
                icon: cl,
                title: "Nenhum lançamento encontrado",
                action: "Novo lan\xE7amento",
                onAction: () => {
                  Ma() || U("entry");
                },
              },
              "Ajuste o período, a conta, o tipo ou a busca para encontrar seus movimentos.",
            ),
        ),
      );
    }
    function eh(n) {
      let f = m.slice(0, 7),
        L = Math.min(
          n.day,
          new Date(Number(m.slice(0, 4)), Number(m.slice(5, 7)), 0).getDate(),
        );
      le((y) => {
        if (y.entries.some((v) => v.recurringId === n.id && v.competence === f))
          throw Error("Esta compet\xEAncia j\xE1 foi registrada.");
        y.entries.push({
          id: ee(),
          recurringId: n.id,
          competence: f,
          title: n.title,
          type: n.type,
          amount: n.amount,
          accountId: n.accountId,
          date: f + "-" + String(L).padStart(2, "0"),
          category: n.category,
        });
      }, "Ocorr\xEAncia confirmada.") && Aa();
    }
    function ah() {
      return r.default.createElement(
        r.default.Fragment,
        null,
        r.default.createElement(
          "div",
          { className: "page-intro" },
          r.default.createElement(
            "p",
            null,
            "Sal\xE1rio e contas que se repetem.",
            r.default.createElement("br", null),
            "Confirme cada m\xEAs uma \xFAnica vez.",
          ),
          r.default.createElement(
            pe,
            {
              label: "Cadastrar recorr\xEAncia",
              onClick: () => {
                Ma() || U("recurring");
              },
            },
            r.default.createElement(be, null),
          ),
        ),
        r.default.createElement(
          "label",
          { className: "field" },
          r.default.createElement("span", null, "Compet\xEAncia"),
          r.default.createElement("input", {
            "aria-label": "Compet\xEAncia",
            type: "month",
            value: m.slice(0, 7),
            onChange: (n) => n.target.value && b(n.target.value + "-10"),
          }),
        ),
        e.recurring.map((n) => {
          let f = e.entries.some(
            (L) => L.recurringId === n.id && L.competence === m.slice(0, 7),
          );
          return r.default.createElement(
            J,
            { key: n.id },
            r.default.createElement(
              "div",
              { className: "card-heading" },
              r.default.createElement(
                "div",
                null,
                r.default.createElement(
                  "span",
                  { className: "round-icon" },
                  r.default.createElement(zt, { size: 20 }),
                ),
                r.default.createElement(
                  "div",
                  null,
                  r.default.createElement("h2", null, n.title),
                  r.default.createElement(
                    "p",
                    null,
                    "Todo dia ",
                    n.day,
                    " \xB7",
                    " ",
                    n.type === "income" ? "Receita" : "Despesa",
                  ),
                ),
              ),
              r.default.createElement(
                pe,
                {
                  label: "Excluir recorr\xEAncia " + n.title,
                  onClick: () => It("recurring", n.id),
                },
                r.default.createElement(Ge, { size: 17 }),
              ),
            ),
            r.default.createElement(
              "div",
              { className: "big-value" },
              P(n.amount),
            ),
            r.default.createElement(Ye, {
              label: "Ativa",
              checked: n.active,
              onChange: (L) =>
                le((y) => {
                  y.recurring.find((v) => v.id === n.id).active = L;
                }),
            }),
            r.default.createElement(
              F,
              {
                variant: "full",
                disabled: f || !n.active,
                onClick: () => U("recurringConfirm", { id: n.id }),
              },
              f
                ? r.default.createElement(Ze, { size: 17 })
                : r.default.createElement(be, { size: 17 }),
              f ? "Compet\xEAncia registrada" : "Confirmar " + m.slice(0, 7),
            ),
          );
        }),
        !e.recurring.length &&
          r.default.createElement(
            St,
            {
              icon: zt,
              title: "Planeje o que se repete",
              action: "Cadastrar recorr\xEAncia",
              onAction: () => {
                Ma() || U("recurring");
              },
            },
            "A confirma\xE7\xE3o cria o lan\xE7amento no extrato. Uma previs\xE3o sozinha n\xE3o altera seu saldo.",
          ),
      );
    }
    function th() {
      return React.createElement(FinanceAgenda, {
        items: Yo(true), selected: m, onSelect: b, onMonth: offset => b(gl(m, offset)), format: value => s ? ye(value) : "••••",
      });
    }
    function lh() {
      return r.default.createElement(
        r.default.Fragment,
        null,
        r.default.createElement(
          "p",
          { className: "page-description" },
          "Ajuste temas, animações e navegação. O tema Apple pode acompanhar a aparência do aparelho.",
        ),
        r.default.createElement(
          "div",
          { className: "settings-sticky" },
          r.default.createElement(
            "span",
            null,
            p
              ? "Altera\xE7\xF5es em pr\xE9via"
              : "Suas prefer\xEAncias est\xE3o salvas",
          ),
          r.default.createElement(
              "div",
              null,
              r.default.createElement(
                "button",
                { className: "text-button", onClick: () => x(null) },
                "Cancelar",
              ),
              React.createElement(SaveToggleButton, {disabled:!p,onSave:()=>{if(!p)return false;const ok=le(data=>{data.settings=structuredClone(p);},"Preferências salvas.");if(ok)x(null);return ok;}}),
            ),
        ),
        React.createElement(PersonalizationStudio, {
          settings: O,
          onSaveGlass: () => {const ok=le(data=>{data.settings=structuredClone(O);},"Vidro salvo.");if(ok)x(null);return ok;},
          themes: Go,
          onChange: next => ge(draft => Object.assign(draft, next)),
          onPersistPresets: presets => le(data => { data.settings.customPresets = structuredClone(presets); }),
          onOpenReference: () => U("catalog"),
        }),
        React.createElement(TrashPanel,{items:e.trash||[],policy:e.trashPolicy||{amount:0,unit:"days"},onPolicy:policy=>le(data=>{data.trashPolicy=policy;purgeExpired(data);},"Prazo da lixeira salvo."),onRestore:id=>le(data=>restoreDeleted(data,id),"Registro restaurado."),onEmpty:()=>le(data=>{data.trash=[];},"Lixeira esvaziada.")}),
        r.default.createElement(
          J,
          { title: "Composição e uso" },
          r.default.createElement(X, { label: "Nome do aplicativo", value: O.appName || "Marks", maxLength: 30, onChange: event => ge(draft => { draft.appName = event.target.value; }) }),
          r.default.createElement("label", { className: "field" }, r.default.createElement("span", null, "Ícone do aplicativo (ajuste automático, até 20 MB)"), r.default.createElement("input", { type: "file", accept: "image/png,image/jpeg,image/webp", onChange: async event => { const file=event.target.files?.[0];if(!file)return;try {const icon=await resizeIcon(file);ge(draft=>{draft.appIcon=icon;});}catch(error){Qe(error.message);} } }), O.appIcon ? r.default.createElement("button", { type: "button", className: "text-button", onClick: () => ge(draft => { draft.appIcon = ""; }) }, "Restaurar ícone original") : null),
          O.appIcon && r.default.createElement(React.Fragment, null, r.default.createElement("label", { className: "field" }, r.default.createElement("span", null, "Ajustar enquadramento horizontal"), r.default.createElement("input", { type: "range", min: 0, max: 100, value: O.appIconX ?? 50, onChange: event => ge(draft => { draft.appIconX = Number(event.target.value); }) })), r.default.createElement("label", { className: "field" }, r.default.createElement("span", null, "Ajustar enquadramento vertical"), r.default.createElement("input", { type: "range", min: 0, max: 100, value: O.appIconY ?? 50, onChange: event => ge(draft => { draft.appIconY = Number(event.target.value); }) })), r.default.createElement("div", { className: "app-icon-preview" }, r.default.createElement(BrandIcon, { image: O.appIcon, position: `${O.appIconX ?? 50}% ${O.appIconY ?? 50}%` }))),
          r.default.createElement(Ye, {
            label: "Ações por deslize",
            description: "Deslize seções e metas para abrir ou excluir",
            checked: O.swipeActions,
            onChange: value => ge(draft => { draft.swipeActions = value; }),
          }),
          React.createElement(FocusDisclosure, { enabled: O.focusMode, agenda: O.components.agenda !== false, onToggle: enabled => ge(draft => { draft.focusMode = enabled; }), onAgenda: enabled => ge(draft => { draft.components.agenda = enabled; }) }),
          r.default.createElement(
            F,
            { variant: "secondary full", onClick: () => U("heroImage", { image: O.heroImage || "" }) },
            r.default.createElement(Tt, { size: 18 }),
            "Imagem do cartão principal",
          ),
        ),
        r.default.createElement(
          J,
          { title: "Seu painel inicial" },
          Object.entries({
            consistency: "Atividade da semana",
            trend: "Evolu\xE7\xE3o das entradas",
            platforms: "Desempenho nas entregas",
            goals: "Metas",
            sections: "Se\xE7\xF5es",
            agenda: "Agenda",
            activity: "\xDAltimos lan\xE7amentos",
            reserve: "Reserva de emerg\xEAncia",
          }).map(([n, f]) =>
            r.default.createElement(Ye, {
              key: n,
              label: f,
              checked: O.components[n],
              onChange: (L) =>
                ge((y) => {
                  y.components[n] = L;
                }),
            }),
          ),
        ),
        r.default.createElement(
          J,
          { title: "Privacidade e lembretes" },
          r.default.createElement(Ye, {
            label: "Mostrar valores ao abrir",
            description: "Desligado: iniciar com todos os valores ocultos",
            checked: O.showOnOpen,
            onChange: (n) =>
              ge((f) => {
                f.showOnOpen = n;
              }),
          }),
          r.default.createElement(Ye, {
            label: "Lembretes de metas",
            description: "Alertas no app e notifica\xE7\xF5es no Android",
            checked: O.notifications,
            onChange: (n) => {
              (ge((f) => {
                f.notifications = n;
              }),
                n && window.NexoNative?.requestNotifications());
            },
          }),
        ),
        r.default.createElement(
          J,
          { title: "Dados e compartilhamento" },
          r.default.createElement(
            F,
            { variant: "secondary full", onClick: () => Us(e) },
            r.default.createElement(Yl, { size: 18 }),
            "Exportar backup",
          ),
          r.default.createElement(
            F,
            {
              variant: "secondary full",
              onClick: () =>
                window.NexoNative
                  ? window.NexoNative.importBackup()
                  : document.getElementById("backup-file").click(),
            },
            r.default.createElement(ml, { size: 18 }),
            "Restaurar backup",
          ),
          r.default.createElement(
            F,
            { variant: "secondary full", onClick: () => U("sharingConfig") },
            r.default.createElement(tt, { size: 18 }),
            "Configurar links restritos",
          ),
          r.default.createElement(
            F,
            { variant: "secondary full", onClick: () => U("demo") },
            r.default.createElement(Ot, { size: 18 }),
            "Carregar dados demonstrativos",
          ),
        ),
        r.default.createElement(
          ve,
          null,
          "Altera\xE7\xF5es de apar\xEAncia s\xF3 s\xE3o gravadas ao tocar em Salvar. O backup cont\xE9m seus dados financeiros; guarde-o em um lugar privado.",
        ),
      );
    }
    function oh() {
      return r.default.createElement(
        r.default.Fragment,
        null,
        r.default.createElement(
          "div",
          { className: "brand-large" },
          React.createElement(BrandIcon,{className:'brand-about-icon'}),
          r.default.createElement("h1", null, "Marks"),
          r.default.createElement("p", null, "Seu dinheiro, com clareza."),
        ),
        React.createElement(FinanceHelp),
        r.default.createElement(
          J,
          { title: "Backups e continuidade" },
          r.default.createElement(
            "p",
            null,
            "Exporte um backup antes de trocar de navegador ou aparelho. Você pode restaurar seus registros em Dados e compartilhamento, na Personalização. O backup é exportado por você. Os links de seções que você publicar seguem as regras de compartilhamento descritas acima.",
          ),
        ),
      );
    }
    function Js(n) {
      return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
    }
    function uh() {
      let n = o,
        f = e.sections.find((v) => v.id === n.id),
        L = e.goals.find((v) => v.id === n.id),
        y = [
          "account",
          "entry",
          "section",
          "payment",
          "delivery",
          "platform",
          "goal",
          "contribution",
          "extend",
          "reserve",
          "recurring",
          "sharingConfig",
        ];
      if (n.type === "heroImage")
        return r.default.createElement(
          r.default.Fragment,
          null,
          r.default.createElement(
            "p",
            { className: "muted" },
            "Escolha uma imagem do aparelho. A camada de contraste mant\xE9m os valores leg\xEDveis.",
          ),
          n.image &&
            r.default.createElement("img", {
              className: "goal-cover",
              src: n.image,
              alt: "Pr\xE9via da imagem do cart\xE3o",
            }),
          r.default.createElement(
            F,
            { variant: "secondary full", onClick: () => tn() },
            r.default.createElement(Tt, { size: 18 }),
            "Escolher imagem",
          ),
          r.default.createElement(
            F,
            {
              variant: "full",
              onClick: () => {
                (ge((v) => {
                  v.heroImage = n.image || "";
                }),
                  Aa());
              },
            },
            "Usar nesta pr\xE9via",
          ),
          r.default.createElement(
            F,
            {
              variant: "secondary full",
              onClick: () => {
                (ge((v) => {
                  v.heroImage = "";
                }),
                  Aa());
              },
            },
            "Remover imagem",
          ),
        );
      if (n.type === 'sharingConfig') return React.createElement(FirebaseConnection);
      if (y.includes(n.type))
        return r.default.createElement(
          "form",
          { onSubmit: jg, className: "form-stack" },
          n.type === "account" &&
            React.createElement(BankFields),
          n.type === "entry" &&
            r.default.createElement(
              r.default.Fragment,
              null,
              r.default.createElement(X, {
                label: "Tipo",
                name: "type",
                options: [
                  { value: "expense", label: "Despesa" },
                  { value: "income", label: "Receita" },
                  {
                    value: "transfer",
                    label: "Transfer\xEAncia entre minhas contas",
                  },
                ],
                defaultValue: "expense",
                onChange: (v) => u({ ...n, entryType: v.target.value }),
              }),
              r.default.createElement(X, {
                label: "T\xEDtulo",
                name: "title",
                required: !0,
                maxLength: 120,
                placeholder: "Ex.: Mercado",
              }),
              Wa(),
              Vl(),
              n.entryType === "transfer" &&
                Vl("toAccountId", "Conta de destino"),
              r.default.createElement(X, {
                label: "Categoria",
                name: "category",
                options: Fg.map((v) => ({ value: v, label: v })),
              }),
              nl(),
              r.default.createElement(X, {
                label: "Se\xE7\xE3o (opcional)",
                name: "sectionId",
                defaultValue: n.sectionId || "",
                options: [
                  { value: "", label: "Sem se\xE7\xE3o" },
                  ...e.sections.map((v) => ({ value: v.id, label: v.title })),
                ],
              }),
            ),
          n.type === "section" &&
            r.default.createElement(
              r.default.Fragment,
              null,
              r.default.createElement(X, {
                label: "T\xEDtulo da se\xE7\xE3o",
                name: "title",
                maxLength: 120,
                required: !0,
                placeholder: "Ex.: Venda do videogame",
              }),
              r.default.createElement(X, {
                label: "Pessoa (opcional)",
                name: "person",
                maxLength: 100,
              }),
              r.default.createElement(X, {
                label: "Finalidade",
                name: "kind",
                options: [
                  { value: "receive", label: "Tenho a receber" },
                  { value: "pay", label: "Tenho a pagar" },
                  { value: "ledger", label: "Organizar lan\xE7amentos livres" },
                ],
                onChange: (v) => u({ ...n, kind: v.target.value }),
              }),
              n.kind !== "ledger" &&
                r.default.createElement(
                  r.default.Fragment,
                  null,
                  Wa("Valor total (R$)"),
                  r.default.createElement(X, {
                    label: "Quantidade de parcelas",
                    name: "count",
                    type: "number",
                    min: "1",
                    max: "600",
                    required: !0,
                    defaultValue: "10",
                  }),
                  nl("Primeiro vencimento"),
                ),
              r.default.createElement(X, {
                label: "Anota\xE7\xE3o privada (n\xE3o vai no link)",
                name: "privateNote",
                type: "textarea",
                maxLength: 1e3,
              }),
              r.default.createElement(
                ve,
                null,
                "Voc\xEA cria o acordo. Os pagamentos s\xF3 entram no saldo quando forem registrados.",
              ),
            ),
          n.type === "payment" &&
            r.default.createElement(
              r.default.Fragment,
              null,
              f &&
                r.default.createElement(
                  "div",
                  { className: "notice" },
                  r.default.createElement(Bt, { size: 20 }),
                  r.default.createElement(
                    "div",
                    null,
                    r.default.createElement(
                      "strong",
                      null,
                      "Parcela ",
                      Ba(f).current?.number,
                    ),
                    r.default.createElement(
                      "p",
                      null,
                      "Previsto: ",
                      ye(Ba(f).current?.due || 0),
                      ". Saldo do acordo: ",
                      ye(Ba(f).remaining),
                      ".",
                    ),
                  ),
                ),
              Wa("Quanto foi pago (R$)"),
              Vl(),
              nl("Data do pagamento"),
              r.default.createElement(
                ve,
                null,
                "Pode registrar zero para carregar o valor integral. Um valor menor leva a falta \xE0 pr\xF3xima parcela; um maior reduz as seguintes.",
              ),
              r.default.createElement(ve, null, "Depois de registrar, abra o lançamento concluído para anexar o comprovante."),
            ),
          n.type === "delivery" &&
            r.default.createElement(
              r.default.Fragment,
              null,
              r.default.createElement(PlatformPicker, { names: e.platforms, settings: e.deliveryPlatformSettings || {} }),
              r.default.createElement(X, {
                label: "Recebimento", name: "receiptStatus", options:[{value:"received",label:"Já recebi na conta"},{value:"pending",label:"A receber na plataforma"}],
              }),
              r.default.createElement(X, {
                label: "Nome do estabelecimento",
                name: "title",
                required: !0,
                maxLength: 120,
                placeholder: "Ex.: Pizza Central",
              }),
              r.default.createElement(X, {
                label: "Endere\xE7o de coleta (opcional)",
                name: "pickup",
                maxLength: 240,
              }),
              r.default.createElement(X, {
                label: "Endere\xE7o do cliente (opcional)",
                name: "destination",
                maxLength: 240,
              }),
              Wa("Valor da entrega (R$)"),
              r.default.createElement(X, {
                label: "Distância percorrida (km, opcional)",
                name: "km",
                inputMode: "decimal",
                placeholder: "Ex.: 4,5",
              }),
              r.default.createElement(X, {
                label: "Custo desta entrega (R$)",
                name: "cost",
                inputMode: "decimal",
                defaultValue: "0",
              }),
              Vl(),
              nl(),
              r.default.createElement(
                ve,
                null,
                "O custo tamb\xE9m gera uma despesa. Registre somente o custo desta corrida, para n\xE3o contar duas vezes o combust\xEDvel.",
              ),
            ),
          n.type === "platform" &&
            r.default.createElement(r.default.Fragment, null, r.default.createElement(X, {
              label: "Nome da plataforma",
              name: "title",
              required: !0,
              maxLength: 80,
              placeholder: "Ex.: Outra plataforma",
            }), r.default.createElement(PlatformIconField)),
          n.type === "goal" &&
            r.default.createElement(
              r.default.Fragment,
              null,
              r.default.createElement(X, {
                label: "T\xEDtulo do objetivo",
                name: "title",
                required: !0,
                maxLength: 120,
                placeholder: "Ex.: Meu pr\xF3ximo notebook",
              }),
              r.default.createElement(X, { label: "Rótulo do prazo", name: "deadlineLabel", maxLength: 32, defaultValue: "Prazo", placeholder: "Ex.: Entrega" }),
              r.default.createElement(X, { label: "Situação", name: "statusLabel", maxLength: 32, defaultValue: "Em andamento", placeholder: "Ex.: Pausada" }),
              r.default.createElement("label", { className: "field" }, r.default.createElement("span", null, "Prioridade"), r.default.createElement("select", { name: "priority", defaultValue: "Normal" }, ["Baixa", "Normal", "Alta", "Urgente"].map(value => r.default.createElement("option", { key: value, value }, value)))),
              Wa("Quanto quero juntar (R$)"),
              nl("Data prevista"),
              r.default.createElement(X, {
                label: "Link do produto (opcional)",
                name: "link",
                type: "url",
                placeholder: "https://",
              }),
              r.default.createElement(
                "div",
                { className: "image-picker" },
                n.image &&
                  r.default.createElement("img", {
                    src: n.image,
                    alt: "Imagem escolhida para a meta",
                  }),
                r.default.createElement(
                  F,
                  { type: "button", variant: "secondary", onClick: () => tn() },
                  r.default.createElement(Tt, { size: 18 }),
                  n.image ? "Trocar imagem" : "Adicionar imagem",
                ),
              ),
              r.default.createElement(
                ve,
                null,
                "Crie a meta e depois escolha de qual conta vai separar os aportes.",
              ),
            ),
          n.type === "contribution" &&
            r.default.createElement(
              r.default.Fragment,
              null,
              React.createElement(ContributionPlanner, { parse: Rl, format: ye, accounts: e.accounts.map(account => ({ id: account.id, title: account.title, available: Cr(e, account.id), allocated: L?.contributions.filter(item => item.accountId === account.id).reduce((sum, item) => sum + item.amount, 0) || 0 })) }),
              nl(),
              r.default.createElement(
                ve,
                null,
                "Voc\xEA est\xE1 organizando o saldo j\xE1 existente no banco. Para dinheiro novo, cadastre primeiro uma receita.",
              ),
            ),
          n.type === "extend" &&
            r.default.createElement(
              r.default.Fragment,
              null,
              nl("Novo prazo", "date", L?.due || Ve()),
              r.default.createElement(
                ve,
                null,
                "O hist\xF3rico dos prazos anteriores ser\xE1 preservado.",
              ),
            ),
          n.type === "reserve" &&
            React.createElement(ReserveTransactionFields, { data: e, accountId: n.accountId }),
          n.type === "recurring" &&
            r.default.createElement(
              r.default.Fragment,
              null,
              r.default.createElement(X, {
                label: "T\xEDtulo",
                name: "title",
                required: !0,
                maxLength: 120,
              }),
              r.default.createElement(X, {
                label: "Tipo",
                name: "type",
                options: [
                  { value: "expense", label: "Despesa recorrente" },
                  {
                    value: "income",
                    label: "Sal\xE1rio ou receita recorrente",
                  },
                ],
              }),
              Wa(),
              r.default.createElement(X, {
                label: "Dia do m\xEAs",
                name: "day",
                type: "number",
                min: "1",
                max: "31",
                required: !0,
                defaultValue: "5",
              }),
              Vl(),
              r.default.createElement(X, {
                label: "Categoria",
                name: "category",
                options: Fg.map((v) => ({ value: v, label: v })),
              }),
              r.default.createElement(
                ve,
                null,
                "Meses menores usam o \xFAltimo dia v\xE1lido. A ocorr\xEAncia s\xF3 entra no saldo quando voc\xEA confirmar.",
              ),
            ),
          n.type === "sharingConfig" &&
            r.default.createElement(
              r.default.Fragment,
              null,
              r.default.createElement(X, {
                label: "Endere\xE7o HTTPS do servidor",
                name: "url",
                type: "url",
                defaultValue: e.sharing.url,
                placeholder: "https://seu-servidor.exemplo",
              }),
              r.default.createElement(X, {
                label: "Chave de cria\xE7\xE3o de links",
                name: "key",
                type: "password",
                defaultValue: e.sharing.key,
                autoComplete: "off",
              }),
              r.default.createElement(
                ve,
                null,
                "O compartilhamento exige um servidor compatível, a ser configurado na etapa do aplicativo. Nenhum dado \xE9 enviado antes de tocar em Publicar se\xE7\xE3o.",
              ),
            ),
          ["entry"].includes(n.type) &&
            r.default.createElement(
              "div",
              { className: "image-picker" },
              n.image &&
                r.default.createElement("img", {
                  src: n.image,
                  alt: "Comprovante escolhido",
                }),
              r.default.createElement(
                F,
                { type: "button", variant: "secondary", onClick: () => tn() },
                r.default.createElement(Tt, { size: 18 }),
                n.image
                  ? "Trocar comprovante"
                  : "Anexar comprovante (opcional)",
              ),
              r.default.createElement(
                "small",
                null,
                "O comprovante fica privado no aparelho e no backup.",
              ),
            ),
          I &&
            r.default.createElement(
              "p",
              { className: "form-error", role: "alert" },
              I,
            ),
          r.default.createElement(
            F,
            { variant: "full", type: "submit" },
            r.default.createElement(Ze, { size: 18 }),
            n.type === "payment" ? "Registrar pagamento" : "Salvar",
          ),
        );
      if(n.type === 'create') return React.createElement(CreateNewDisclosure,{initialOpen:true,onSelect:(id)=>{(['entry','delivery','recurring'].includes(id)&&Ma())||U(id)}});
      if (n.type === "info")
        return r.default.createElement("p", { className: "info-copy" }, n.text);
      if (n.type === "delete")
        return r.default.createElement(
          r.default.Fragment,
          null,
          r.default.createElement(
            "div",
            { className: "notice" },
            r.default.createElement(Ge, { size: 24 }),
            r.default.createElement(
              "p",
              null,
              "Excluir este registro? Essa a\xE7\xE3o ser\xE1 salva no aparelho.",
            ),
          ),
          r.default.createElement(
            ve,
            null,
            n.kind === "section"
              ? "As transa\xE7\xF5es j\xE1 confirmadas ser\xE3o preservadas no extrato. Revogue qualquer link publicado antes de excluir a se\xE7\xE3o."
              : n.kind === "goal"
                ? "O dinheiro da meta volta a ficar livre nas contas. Os lan\xE7amentos banc\xE1rios permanecem no extrato."
                : n.kind === "account"
                  ? "S\xF3 \xE9 poss\xEDvel excluir uma conta sem lan\xE7amentos, reserva ou aportes."
                  : "Se esse registro estiver associado a uma entrega ou parcela, remova pela tela de origem.",
          ),
          r.default.createElement(
            F,
            {
              variant: "danger full",
              onClick: () => {
                le((S) => {
                  if (n.kind === "section") {
                    if (S.sharing.grants[n.id])
                      throw Error(
                        "Revogue o link desta se\xE7\xE3o antes de exclu\xED-la.",
                      );
                    ((S.sections = S.sections.filter((k) => k.id !== n.id)),
                      S.entries.forEach((k) => {
                        k.sectionId === n.id &&
                          (delete k.sectionId, delete k.paymentId);
                      }));
                  }
                  if (
                    (n.kind === "goal" &&
                      (S.goals = S.goals.filter((k) => k.id !== n.id)),
                    n.kind === "account")
                  ) {
                    if (
                      S.entries.some(
                        (k) => k.accountId === n.id || k.toAccountId === n.id,
                      ) ||
                      S.goals.some((k) =>
                        k.contributions.some((q) => q.accountId === n.id),
                      ) ||
                      S.reserve.some((k) => k.accountId === n.id && k.amount) ||
                      S.reserveTransactions?.some((k) => k.accountId === n.id)
                    )
                      throw Error(
                        "Conta em uso. Remova ou mova seus v\xEDnculos antes.",
                      );
                    ((S.accounts = S.accounts.filter((k) => k.id !== n.id)),
                      (S.reservePlans = (S.reservePlans || []).filter(k => k.accountId !== n.id)),
                      (S.reserve = S.reserve.filter(
                        (k) => k.accountId !== n.id,
                      )),
                      (S.recurring = S.recurring.filter(
                        (k) => k.accountId !== n.id,
                      )));
                  }
                  if (n.kind === "entry") {
                    let k = S.entries.find((q) => q.id === n.id);
                    if (k?.paymentId || k?.deliveryId || k?.deliveryPayoutId)
                      throw Error(
                        "Use o estorno na parcela ou a exclus\xE3o da entrega.",
                      );
                    S.entries = S.entries.filter((q) => q.id !== n.id);
                  }
                  (n.kind === "delivery" &&
                    ((S.deliveries = S.deliveries.filter((k) => k.id !== n.id)),
                    (S.entries = S.entries.filter(
                      (k) => k.deliveryId !== n.id,
                    ))),
                    n.kind === "recurring" &&
                      (S.recurring = S.recurring.filter((k) => k.id !== n.id)));
                }, "Registro exclu\xEDdo.") && (Aa(), g(null));
              },
            },
            r.default.createElement(Ge, { size: 18 }),
            "Excluir registro",
          ),
        );
      if (n.type === "undoPayment")
        return r.default.createElement(
          r.default.Fragment,
          null,
          r.default.createElement(
            "p",
            null,
            "Estornar o \xFAltimo pagamento desta se\xE7\xE3o e recalcular o cronograma? O lan\xE7amento correspondente tamb\xE9m ser\xE1 removido do extrato.",
          ),
          r.default.createElement(
            F,
            {
              variant: "danger full",
              onClick: () => {
                le((v) => {
                  let S = v.sections.find((q) => q.id === n.id),
                    k = S.payments.pop();
                  for (; S.payments.at(-1)?.auto;) S.payments.pop();
                  v.entries = v.entries.filter((q) => q.paymentId !== k.id);
                }, "Pagamento estornado.") && Aa();
              },
            },
            r.default.createElement(pl, { size: 18 }),
            "Confirmar estorno",
          ),
        );
      if (n.type === "sectionMenu")
        return r.default.createElement(
          "div",
          { className: "menu-list" },
          r.default.createElement(
            "button",
            {
              onClick: () => {
                le(
                  (v) => {
                    let S = v.sections.find((k) => k.id === n.id);
                    S.pinned = !S.pinned;
                  },
                  f.pinned ? "Se\xE7\xE3o desafixada." : "Se\xE7\xE3o fixada.",
                ) && Aa();
              },
            },
            r.default.createElement(Kl, null),
            f.pinned ? "Desafixar se\xE7\xE3o" : "Fixar se\xE7\xE3o",
            r.default.createElement(Pe, null),
          ),
          r.default.createElement(
            "button",
            { onClick: () => U("share", { id: n.id }) },
            r.default.createElement(tt, null),
            "Compartilhar se\xE7\xE3o",
            r.default.createElement(Pe, null),
          ),
          r.default.createElement(
            "button",
            {
              onClick: () =>
                U("info", {
                  title: "Anota\xE7\xE3o privada",
                  text:
                    f.privateNote ||
                    "Sem anota\xE7\xE3o privada nesta se\xE7\xE3o.",
                }),
            },
            r.default.createElement(cl, null),
            "Anota\xE7\xE3o privada",
            r.default.createElement(Pe, null),
          ),
          r.default.createElement(
            "button",
            { className: "negative-text", onClick: () => It("section", n.id) },
            r.default.createElement(Ge, null),
            "Excluir se\xE7\xE3o",
            r.default.createElement(Pe, null),
          ),
        );
      if (n.type === 'share') return React.createElement(FirebaseSectionShare,{title:f?.title||'esta seção',grant:e.sharing.grants[n.id],busy:N,onPublish:()=>Gg(n.id),onRevoke:()=>Vg(n.id),onSend:Xg});
      if (n.type === "entryDetail") {
          let v = e.entries.find((entry) => entry.id === n.entry.id) || n.entry;
        return r.default.createElement(
          r.default.Fragment,
          null,
          r.default.createElement(
            "div",
            { className: "big-value" },
            P(v.amount),
          ),
          v.image &&
            r.default.createElement("img", {
              className: "goal-cover",
              src: v.image,
              alt: "Comprovante deste lan\xE7amento", loading:"lazy", decoding:"async",
            }),
          r.default.createElement(
            "div",
            { className: "entry-receipt-actions" },
            r.default.createElement(
              F,
              { type: "button", variant: "secondary", onClick: tn },
              r.default.createElement(Tt, { size: 17 }),
              v.image ? "Trocar comprovante" : "Anexar comprovante",
            ),
            v.image && r.default.createElement(
              F,
              { type: "button", variant: "secondary", onClick: () => saveEntryReceipt("") },
              "Remover",
            ),
          ),
          r.default.createElement(ve, null, "Comprovante salvo neste aparelho. Não é enviado junto ao link compartilhado."),
          [
            [
              "Tipo",
              v.type === "income"
                ? "Receita"
                : v.type === "expense"
                  ? "Despesa"
                  : "Transfer\xEAncia",
            ],
            ["Data", fa(v.date)],
            ["Conta", e.accounts.find((S) => S.id === v.accountId)?.title],
            ["Categoria", v.category],
          ].map(([S, k]) =>
            r.default.createElement(
              "div",
              { className: "simple-row", key: S },
              r.default.createElement("span", null, S),
              r.default.createElement("strong", null, k),
            ),
          ),
          v.paymentId || v.deliveryId || v.deliveryPayoutId
            ? r.default.createElement(
                ve,
                null,
                "Este lan\xE7amento foi gerado por",
                " ",
                v.paymentId ? "uma parcela" : "uma entrega",
                ". Para remov\xEA-lo, abra o registro de origem.",
              )
            : r.default.createElement(
                F,
                { variant: "danger full", onClick: () => It("entry", v.id) },
                r.default.createElement(Ge, { size: 18 }),
                "Excluir lan\xE7amento",
              ),
        );
      }
      if (n.type === "deliveryDetail") {
        let v = n.delivery;
        return r.default.createElement(
          r.default.Fragment,
          null,
          r.default.createElement(
            "div",
            { className: "big-value" },
            P(v.amount),
          ),
          [
            ["Plataforma", v.platform],
            ["Estabelecimento", v.title],
            ["Coleta", v.pickup || "N\xE3o informado"],
            ["Destino", v.destination || "N\xE3o informado"],
            ["Dist\xE2ncia", v.km + " km"],
            [
              "Receita por km",
              v.km ? (s ? ye(Math.round(v.amount / v.km)) : "••••") : "Sem distância informada",
            ],
            ["Custo", s ? ye(v.cost) : "\u2022\u2022\u2022\u2022"],
            ["Data", fa(v.date)],
          ].map(([S, k]) =>
            r.default.createElement(
              "div",
              { className: "simple-row", key: S },
              r.default.createElement("span", null, S),
              r.default.createElement("strong", null, k),
            ),
          ),
          r.default.createElement(DeliveryRouteMap, { pickup: v.pickup, destination: v.destination }),
          r.default.createElement(
            F,
            { variant: "danger full", onClick: () => It("delivery", v.id) },
            r.default.createElement(Ge, { size: 18 }),
            "Excluir entrega e lan\xE7amentos",
          ),
        );
      }
      if (n.type === "recurringConfirm") {
        let v = e.recurring.find((S) => S.id === n.id);
        return r.default.createElement(
          r.default.Fragment,
          null,
          r.default.createElement(
            "p",
            null,
            "Confirmar ",
            v.title,
            " no valor de ",
            ye(v.amount),
            " para a compet\xEAncia",
            " ",
            m.slice(0, 7),
            "?",
          ),
          r.default.createElement(
            F,
            { variant: "full", onClick: () => eh(v) },
            r.default.createElement(Ze, { size: 18 }),
            "Confirmar ocorr\xEAncia",
          ),
        );
      }
      return n.type === "demo"
        ? r.default.createElement(
            r.default.Fragment,
            null,
            r.default.createElement(
              "p",
              null,
              "Carregar um conjunto de demonstra\xE7\xE3o para explorar os temas e componentes? Isso substitui os dados atuais. Exporte um backup antes de continuar.",
            ),
            r.default.createElement(
              F,
              { variant: "secondary full", onClick: () => Us(e) },
              r.default.createElement(Yl, { size: 18 }),
              "Exportar meus dados",
            ),
            r.default.createElement(
              F,
              {
                variant: "full",
                onClick: () => {
                  let v = bf();
                  ((v.settings = structuredClone(e.settings)),
                    le(
                      (S) => Object.assign(S, v),
                      "Demonstra\xE7\xE3o carregada.",
                      { replaceData: !0 },
                    ) && (Aa(), c(!0), ke("dashboard")));
                },
              },
              "Carregar demonstra\xE7\xE3o",
            ),
          )
        : n.type === "importConfirm"
          ? r.default.createElement(
              r.default.Fragment,
              null,
              r.default.createElement(
                "p",
                null,
                "Substituir os dados atuais pelos ",
                n.importData.entries.length,
                " ",
                "lan\xE7amentos e ",
                n.importData.accounts.length,
                " contas deste backup?",
              ),
              r.default.createElement(
                F,
                {
                  variant: "full",
                  onClick: () => {
                    le(
                      (v) => Object.assign(v, n.importData),
                      "Backup restaurado.",
                      { replaceData: !0 },
                    ) && (Aa(), x(null), ke("dashboard"));
                  },
                },
                r.default.createElement(ml, { size: 18 }),
                "Restaurar este backup",
              ),
            )
          : n.type === "loadError"
            ? r.default.createElement(
                r.default.Fragment,
                null,
                r.default.createElement(
                  "p",
                  null,
                  "O arquivo salvo n\xE3o p\xF4de ser aberto. Os dados existentes n\xE3o foram substitu\xEDdos.",
                ),
                r.default.createElement(
                  "p",
                  { className: "form-error" },
                  window.nexoLoadError,
                ),
                r.default.createElement(
                  F,
                  {
                    variant: "full",
                    onClick: () =>
                      window.NexoNative
                        ? window.NexoNative.importBackup()
                        : document.getElementById("backup-file").click(),
                  },
                  "Restaurar backup",
                ),
                r.default.createElement(
                  ve,
                  null,
                  "Evite criar novos lan\xE7amentos antes de recuperar seu backup.",
                ),
              )
            : n.type === "catalog"
              ? r.default.createElement(ComponentGallery, { notify: Qe })
              : null;
    }
    let rh = {
        account: "Nova conta",
        entry: "Novo lan\xE7amento",
        section: "Nova se\xE7\xE3o",
        payment: "Registrar pagamento",
        delivery: "Nova entrega",
        platform: "Adicionar plataforma",
        goal: "Novo objetivo",
        contribution: "Organizar aporte",
        extend: "Ajustar prazo",
        reserve: "Reserva de emerg\xEAncia",
        recurring: "Nova recorr\xEAncia",
        heroImage: "Imagem do cart\xE3o principal",
        sharingConfig: "Links de acompanhamento",
        create: "O que vamos registrar?",
        delete: "Excluir registro",
        undoPayment: "Estornar pagamento",
        sectionMenu: "Op\xE7\xF5es da se\xE7\xE3o",
        share: "Compartilhar se\xE7\xE3o",
        entryDetail: o?.entry?.title || "Lan\xE7amento",
        deliveryDetail: "Detalhes da entrega",
        recurringConfirm: "Confirmar recorr\xEAncia",
        demo: "Dados demonstrativos",
        importConfirm: "Restaurar backup",
        catalog: "Referência das interações",
        loadError: "Recuperar seus dados",
      },
      ih = {
        dashboard: Zg,
        sections: Kg,
        goals: Jg,
        deliveries: Wg,
        accounts: Rg,
        entries: $g,
        recurring: ah,
        agenda: th,
        settings: lh,
        help: oh,
      };
    return r.default.createElement(
      MotionAppRoot,
      { className: "app navigation-" + O.nav, settings: O },
      r.default.createElement(
        "header",
        { className: "app-header" },
          t !== "dashboard" && r.default.createElement(motion.button, {
            type:"button", className:"screen-back-button", "aria-label":"Voltar uma tela", title:"Voltar",
            onClick:backScreen, whileHover:{x:-2}, whileTap:{scale:.94}, transition:{type:"spring",stiffness:360,damping:28}
          }, r.default.createElement($a,{size:19,strokeWidth:1.8})),

        r.default.createElement(
          "button",
          {
            className: "brand",
            onClick: () => ke("dashboard"),
            "aria-label": "Marks in\xEDcio",
          },
          React.createElement(BrandIcon,{className:'brand-icon',image:O.appIcon,position:`${O.appIconX ?? 50}% ${O.appIconY ?? 50}%`}),
          r.default.createElement("span", null, O.appName || "Marks"),
        ),
        r.default.createElement(
          "div",
          { className: "header-actions" },
          React.createElement(CommandPalette,{onNavigate:ke,onCreate:U,data:e}),
          r.default.createElement(
            pe,
            { label: "Agenda", onClick: toggleAgenda, "aria-pressed": t === "agenda" },
            r.default.createElement(Ra, { size: 21 }),
            Yo().some((n) => n.date < Ve()) &&
              r.default.createElement("i", { className: "notification-dot" }),
          ),
          r.default.createElement(
            pe,
            { label: "Abrir menu", onClick: () => d((n) => !n) },
            r.default.createElement(Ro, { size: 22 }),
          ),
        ),
      ),
      r.default.createElement(AnimatePresence,{initial:false}, i &&
        r.default.createElement(
          motion.div,
          {key:"profile-menu",className:"profile-menu-layer",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.18}},
          r.default.createElement("div", {
            className: "menu-scrim",
            onClick: () => d(!1),
          }),
          r.default.createElement(
            motion.div,
            { className: "profile-menu", initial:{opacity:0,scale:.985,y:-8}, animate:{opacity:1,scale:1,y:0}, exit:{opacity:0,scale:.985,y:-6}, transition:{type:"tween",duration:.24,ease:[.22,1,.36,1]} },
            r.default.createElement(
              "div",
              { className: "profile-top" },
              r.default.createElement(
                "div",
                null,
                r.default.createElement(
                  "strong",
                  null,
                  "Seu espa\xE7o financeiro",
                ),
                r.default.createElement("small", null, "Salvo neste aparelho"),
              ),
              r.default.createElement(Et, { size: 20 }),
            ),
            r.default.createElement(
              "div",
              { className: "menu-list" },
              [
                ["accounts", "Contas e reserva", lt],
                ["entries", "Lan\xE7amentos", cl],
                ["recurring", "Recorr\xEAncias", zt],
                ["agenda", "Agenda", Ra],
                ["settings", "Personaliza\xE7\xE3o", eu],
                ["help", "Ajuda e privacidade", Mt],
              ].map(([n, f, L],index) =>
                r.default.createElement(
                  motion.button,
                  { key: n, "aria-label": f, title: f, onClick: () => ke(n), initial:{opacity:0,y:-4}, animate:{opacity:1,y:0}, transition:{delay:.035*index,duration:.18}, whileHover:{x:2}, whileTap:{scale:.985} },
                  r.default.createElement(L, { size: 20 }),
                  r.default.createElement("span", null, f),
                  r.default.createElement(Pe, { size: 17 }),
                ),
              ),
            ),
            r.default.createElement(
              "div",
              { className: "menu-footer" },
              React.createElement(ThemeMorphToggle, {
                dark: we.dark,
                onToggle: () => {
                  le((n) => { n.settings.theme = O.theme.startsWith("apple-") ? (we.dark ? "apple-light" : "apple-dark") : O.theme.startsWith("glossary-") ? O.theme.replace(/-(dark|light)$/,we.dark?"-light":"-dark") : (we.dark?O.theme+"-light":O.theme.replace("-light","")); });
                  x(null);
                },
              }),
            ),
          ),
        ),
      ),
      r.default.createElement(
        ScreenTransition,
        { key: t + Z + j, className: "screen" },
        r.default.createElement(
          "div",
          { className: "screen-heading" },
          r.default.createElement(
            "div",
            { className: t !== "dashboard" ? "screen-heading-title" : "" },
            r.default.createElement(
              "p",
              null,
              t === "dashboard"
                ? new Date(Ve() + "T12:00:00").toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                : "Finanças pessoais",
            ),
            r.default.createElement("h1", null, rv[t]),
          ),
          t !== "dashboard" &&
            t !== "settings" &&
            r.default.createElement(
              pe,
              {
                label: "Mostrar ou ocultar valores",
                onClick: () => c((n) => !n),
              },
              s
                ? r.default.createElement(Ql, { size: 18 })
                : r.default.createElement(fl, { size: 18 }),
            ),
        ),
        t === 'dashboard' && React.createElement(DashboardTools,{data:e,onNavigate:ke,onCreate:U}),
        ih[t](),
      ),
      r.default.createElement(cn, {
        items: [
          ["dashboard", "In\xEDcio", Dt],
          ["sections", "Se\xE7\xF5es", ta],
          ["deliveries", "Entregas", Ta],
          ["goals", "Metas", Pa],
        ],
        active: t,
        onNavigate: ke,
        hidden: i || !!o,
        onCreate: () => U("create"),
        settings: O,
      }),
      React.createElement(AnimatePresence, {initial:false,mode:'wait'},
      o &&
        r.default.createElement(
          Hg,
          {
            key: o.type,
            title: o.type === "info" ? o.title : rh[o.type] || "Marks",
            onClose: () => Aa(),
          },
          uh(),
        )),
      D &&
        r.default.createElement(
          "div",
          { className: "toast", role: "status" },
          r.default.createElement(At, { size: 18 }),
          r.default.createElement("span", null, D),
          /exclu/i.test(D)&&e.trash?.length>0&&React.createElement("button",{type:"button",onClick:()=>le(data=>restoreDeleted(data,e.trash[e.trash.length-1].id),"Exclusão desfeita.")},"Desfazer"),
        ),
      r.default.createElement("input", {
        id: "backup-file",
        type: "file",
        accept: "application/json,.json",
        hidden: !0,
        onChange: async (n) => {
          let f = n.target.files?.[0];
          if (f) {
            try {
              if (f.size > 2e7) throw Error("Arquivo maior que 20 MB.");
              let L = $l(JSON.parse(await f.text()));
              U("importConfirm", { importData: L });
            } catch (L) {
              Qe(L.message);
            }
            n.target.value = "";
          }
        },
      }),
      r.default.createElement("input", {
        id: "image-file",
        type: "file",
        accept: "image/*",
        hidden: !0,
        onChange: async (n) => {
          let f = n.target.files?.[0];
          if (f) {
            try {
              if (f.size > 15e6) throw Error("Imagem maior que 15 MB.");
              let L = await createImageBitmap(f),
                y = document.createElement("canvas"),
                v = Math.min(1, 1e3 / L.width, 1e3 / L.height);
              ((y.width = L.width * v),
                (y.height = L.height * v),
                y.getContext("2d").drawImage(L, 0, 0, y.width, y.height),
                saveEntryReceipt(y.toDataURL("image/jpeg", 0.8)),
                L.close());
            } catch {
              Qe("N\xE3o foi poss\xEDvel ler a imagem.");
            }
            n.target.value = "";
          }
        },
      }),
    );
  }
  function nv({ notify: e }) {
    let [a, t] = (0, r.useState)(!0),
      [l, o] = (0, r.useState)("week"),
      [u, i] = (0, r.useState)(0.34),
      [d, s] = (0, r.useState)(!1);
    return r.default.createElement(
      "div",
      { className: "catalog" },
      r.default.createElement(
        ve,
        null,
        "Amostras ilustrativas. Os controles desta tela n\xE3o alteram seus dados.",
      ),
      r.default.createElement("h3", null, "Morph de formas e estados"),
      r.default.createElement(Ps, null),
      r.default.createElement("h3", null, "Bot\xF5es de vidro e relevo"),
      r.default.createElement(
        "div",
        { className: "catalog-buttons" },
        [be, Da, Ze, cl, sl].map((c, h) =>
          r.default.createElement(
            pe,
            {
              key: h,
              label: "Testar bot\xE3o " + (h + 1),
              onClick: () => e("Bot\xE3o " + (h + 1) + " acionado."),
            },
            r.default.createElement(c, null),
          ),
        ),
        r.default.createElement(
          F,
          { onClick: () => s((c) => !c) },
          r.default.createElement(et, { size: 19 }),
          "Menu",
        ),
      ),
      d &&
        r.default.createElement(
          "div",
          { className: "context-menu" },
          [
            [tt, "Compartilhar"],
            [Zl, "Abrir link"],
            [Kl, "Fixar"],
            [Ge, "Excluir"],
          ].map(([c, h]) =>
            r.default.createElement(
              "button",
              {
                key: h,
                onClick: () => {
                  (e(h + " testado."), s(!1));
                },
              },
              r.default.createElement(c, { size: 18 }),
              h,
            ),
          ),
        ),
      r.default.createElement("h3", null, "Interruptores e sele\xE7\xE3o"),
      r.default.createElement(Ye, {
        label: "Interruptor com relevo",
        checked: a,
        onChange: t,
      }),
      r.default.createElement(Ye, {
        label: "Dia e noite",
        checked: a,
        onChange: t,
        day: !0,
      }),
      r.default.createElement(Wi, {
        label: "Amostra de per\xEDodo",
        options: [
          { value: "day", label: "Dia" },
          { value: "week", label: "Semana" },
          { value: "month", label: "M\xEAs" },
        ],
        value: l,
        onChange: o,
      }),
      r.default.createElement(
        "h3",
        null,
        "Progresso com tr\xEAs etapas de cor",
      ),
      r.default.createElement(
        "div",
        { className: "component-preview" },
        r.default.createElement(Pl, { progress: u }),
        r.default.createElement(
          "div",
          { className: "grow" },
          r.default.createElement("strong", null, "Meu objetivo"),
          r.default.createElement(Gl, { value: u }),
          r.default.createElement(
            "small",
            null,
            Math.round(u * 100),
            "% conclu\xEDdo",
          ),
        ),
      ),
      r.default.createElement(
        "label",
        { className: "field" },
        r.default.createElement("span", null, "Arraste para testar o morph"),
        r.default.createElement("input", {
          "aria-label": "Progresso de teste",
          type: "range",
          min: "0",
          max: "1",
          step: ".01",
          value: u,
          onChange: (c) => i(Number(c.target.value)),
        }),
      ),
      r.default.createElement("h3", null, "Gr\xE1ficos e indicadores"),
      ["area", "bars", "line"].map((c) =>
        r.default.createElement(
          J,
          {
            key: c,
            title: { area: "\xC1rea", bars: "Barras", line: "Linha" }[c],
            subtitle: "Receita ilustrativa em R$",
          },
          r.default.createElement(Fs, {
            kind: c,
            values: [2200, 3400, 1800, 4800, 4200, 6100, 5600],
            labels: ["S", "T", "Q", "Q", "S", "S", "D"],
          }),
        ),
      ),
      r.default.createElement("h3", null, "Trilha semanal"),
      r.default.createElement(
        "div",
        { className: "week-track" },
        ["S", "T", "Q", "Q", "S", "S", "D"].map((c, h) =>
          r.default.createElement(
            "button",
            {
              key: h,
              "aria-label": "Dia de teste " + (h + 1),
              onClick: () => e("Dia " + (h + 1) + " selecionado."),
            },
            r.default.createElement(
              "span",
              null,
              h < 4 ? r.default.createElement(Ze, { size: 17 }) : h + 1,
            ),
            r.default.createElement("small", null, c),
          ),
        ),
      ),
      r.default.createElement("h3", null, "Campo, estado e alerta"),
      r.default.createElement(X, {
        label: "T\xEDtulo de teste",
        name: "test",
        placeholder: "Escreva aqui",
      }),
      r.default.createElement("div", { className: "badge" }, "Parcela extra"),
      r.default.createElement(
        "div",
        { className: "notice" },
        r.default.createElement(sl, null),
        r.default.createElement(
          "p",
          null,
          "Exemplo de aviso de prazo com a\xE7\xE3o clara.",
        ),
      ),
      r.default.createElement(
        F,
        {
          variant: "danger full",
          onClick: () =>
            e(
              "A\xE7\xE3o de exclus\xE3o de teste acionada. Nenhum dado foi removido.",
            ),
        },
        r.default.createElement(Ge, { size: 18 }),
        "Testar a\xE7\xE3o destrutiva",
      ),
    );
  }

export default function NexoApp(){return React.createElement(MotionConfig,{reducedMotion:'user',transition:{type:'spring',stiffness:320,damping:32}},React.createElement(iv));}
