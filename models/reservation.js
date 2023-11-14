/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");


/** A reservation for a party */

class Reservation {
  constructor({id, customerId, numGuests, startAt, notes}) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  /** formatter for startAt */

  getformattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
          `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
        [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }

async save() {
  if (this.customerId === undefined) {
    const result = await db.query(
      `INSERT INTO reservations (num_guests, start_at, notes)
           VALUES ($1, $2, $3)
           RETURNING customer_id`,
      [this.numGuests, this.startAt, this.notes]
    );
    console.log(this.customerId)
    this.customerId = result.rows[0].customerId;
  } else {
    await db.query(
      `UPDATE reservations SET num_guests=$1, start_at=$2, notes=$3
           WHERE customer_id=$4`,
      [this.numGuests, this.startAt, this.notes, this.customerId]
    );
  }
}
}

module.exports = Reservation;
