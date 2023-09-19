import * as Notifications from "expo-notifications";
import { addDays } from "date-fns";
import { auth,db } from "../(tabs)/_layout";
import { set, ref } from "firebase/database";

const user = auth.currentUser;

const scheduleExpirationNotifications = (
  productName: string,
  idProduct: string | number[],
  expirationDates: Date[]
) => {
  const responsesByDate: Record<number, string[]> = {};
  const currentDate = new Date();

  expirationDates.forEach((expirationDate, index) => {
    for (let i = 3; i >= 0; i--) {
      const notifyDate = addDays(expirationDate, -i);

      // Ajuster l'heure pour 10h00
      notifyDate.setHours(10, 0, 0, 0);

      if (i === 0 && notifyDate.toDateString() === currentDate.toDateString()) {

        Notifications.scheduleNotificationAsync({
          content: {
            title: "Produit périmé aujourd'hui",
            body: `Votre produit ${productName} a expiré aujourd'hui.`,
          },
          trigger: {
            date: notifyDate,
          },
        }).then((response) => {
          // Obtenez l'idDate correspondant à cette notification
          const idDate = index;
          // Ajoutez la réponse à l'objet regroupé par idDate
          if (!responsesByDate[idDate]) {
            responsesByDate[idDate] = [];
          }
          responsesByDate[idDate].push(response);

          
          console.log(response, "response");
          if (user) {
            set(
              ref(db, `users/${user.uid}/products/${idProduct}/notifications`),
              { responsesByDate }
            )
              .then(() => console.log("success"))
              .catch((error) => console.log(error));
          }
        });

      } else {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Produit proche de la date d'expiration",
            body: `Votre produit ${productName} expire dans ${i} jours.`,
          },
          trigger: {
            date: notifyDate,
          },
        }).then((response) => {
          // Obtenez l'idDate correspondant à cette notification
          const idDate = index;
          // Ajoutez la réponse à l'objet regroupé par idDate
          if (!responsesByDate[idDate]) {
            responsesByDate[idDate] = [];
          }
          responsesByDate[idDate].push(response);
          console.log(response, "response");
          if (user) {
            set(
              ref(db, `users/${user.uid}/products/${idProduct}/notifications`),
              { responsesByDate }
            )
              .then(() => console.log("success"))
              .catch((error) => console.log(error));
          }
        });
      }
    }
  });
};

const convertStringToDate = (dateStr: string) => {
  // Divisez la chaîne en parties (jour, mois, année) en supposant le format "MM/DD/YYYY"
  const parts = dateStr.split("/");
  if (parts.length !== 3) {
    throw new Error("Format de date invalide");
  }

  // Récupérez les parties (en tant que nombres)
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Les mois sont indexés à partir de 0 (janvier est 0)
  const year = parseInt(parts[2], 10);

  // Créez un objet Date
  const date = new Date(Date.UTC(year, month, day, 0, 0, 0));
  console.log(date, "date");

  // Vérifiez si la date est valide
  if (isNaN(date.getTime())) {
    throw new Error("Date invalide");
  }

  return date;
};

export { scheduleExpirationNotifications, convertStringToDate };
