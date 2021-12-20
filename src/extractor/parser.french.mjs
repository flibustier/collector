import { logger } from './logger.mjs';

export const parseFrenchDate = dateString => {
  const [year] = dateString.match(/(20[\d]{2})/) || [];
  const month = parseMonth(dateString);
  const [day] = dateString.match(/^(\d+)\s/) || [1];

  return new Date(year, month, day, 12, 0, 0, 0);
};

const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre"
];

export const parseMonth = dateString => {
  for (const [index, month] of months.entries()) {
    if (
      dateString.includes(month) ||
      dateString.includes(month.toLowerCase()) ||
      dateString.includes(
        month
          .toLowerCase()
          .replace("û", "u")
          .replace("é", "e")
      )
    ) {
      return index;
    }
  }

  const [, number, trimestreOrSemestre] =
    dateString.match(/(\d)er?\s(trimestre|semestre)/) || [];
  if (trimestreOrSemestre) {
    return (number - 1) * (trimestreOrSemestre === "trimestre" ? 3 : 6);
  }

  if (dateString.includes("Automne")) return 9;
  if (dateString.includes("Printemps")) return 3;
  if (dateString.includes("Mi-")) return 6;
  if (dateString.includes("dernier trimestre")) return 9;

  logger.warn(`Could not found a month for ${dateString}`);

  return 0;
};
