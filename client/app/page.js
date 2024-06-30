import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1>Real-Time Collaborative Whiteboard</h1>
        <div className={styles.description} style={{ marginTop: "10%" }}>
          <p style={{ marginRight: "20px" }}>
            <a
              href="/signin"
              rel="noopener noreferrer"
            >
              Login
            </a>
          </p>
          <p>
            <a
              href="/signup"
              rel="noopener noreferrer"
            >
              SingUp
            </a>
          </p>
        </div>
      </div>

    </main>
  );
}
