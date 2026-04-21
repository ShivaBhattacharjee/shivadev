import * as os from "node:os";
import { execSync } from "node:child_process";

export function tryExec(command: string): string | undefined {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 2500,
    }).trim();
  } catch {
    return undefined;
  }
}

export function formatGiB(bytes: number): string {
  return (bytes / 1024 ** 3).toFixed(2);
}

export function gatherNeofetchRows(): { label: string; value: string }[] {
  const isDarwin = process.platform === "darwin";
  const isWin = process.platform === "win32";

  const productName = isDarwin ? tryExec("sw_vers -productName") : undefined;
  const productVersion = isDarwin ? tryExec("sw_vers -productVersion") : undefined;
  const buildVersion = isDarwin ? tryExec("sw_vers -buildVersion") : undefined;
  const darwinParts = [
    productName ?? os.type(),
    productVersion,
    buildVersion && `(${buildVersion})`,
    os.machine(),
  ].filter(Boolean) as string[];

  let osLine: string;
  if (isDarwin) {
    osLine = darwinParts.join(" ");
  } else if (isWin) {
    const winVer = typeof os.version === "function" ? os.version() : "";
    osLine = [winVer || `${os.type()} ${os.release()}`, os.machine()].filter(Boolean).join(" ");
  } else {
    osLine = [productName ?? os.type(), productVersion, buildVersion && `(${buildVersion})`, os.machine()]
      .filter(Boolean)
      .join(" ");
  }

  const hostModel = isDarwin ? tryExec("sysctl -n hw.model") : undefined;
  const cpuBrand = isDarwin ? tryExec("sysctl -n machdep.cpu.brand_string") : os.cpus()[0]?.model;

  const total = os.totalmem();
  const used = total - os.freemem();
  const memoryLine = `${formatGiB(used)} GiB / ${formatGiB(total)} GiB`;

  const shellName = isWin
    ? (process.env.ComSpec?.split(/[/\\]/).pop() ?? "—")
    : (process.env.SHELL?.split("/").pop() ?? "—");

  const runtime = process.versions.bun ? `Bun ${process.versions.bun}` : `Node ${process.version}`;

  const kernelLine = isDarwin
    ? `Darwin ${os.release()}`
    : isWin
      ? `Windows NT ${os.release()}`
      : `${os.type()} ${os.release()}`;

  const userName = process.env.USER ?? process.env.USERNAME ?? "—";

  return [
    { label: "OS", value: osLine || `${os.type()} ${os.release()} ${os.machine()}` },
    { label: "Host", value: hostModel ?? os.hostname() },
    { label: "Kernel", value: kernelLine },
    { label: "Shell", value: shellName },
    { label: "Terminal", value: process.env.TERM_PROGRAM ?? process.env.TERM ?? "—" },
    { label: "CPU", value: cpuBrand ?? "—" },
    { label: "Memory", value: memoryLine },
    { label: "User", value: userName },
    { label: "Runtime", value: runtime },
  ];
}

export function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}

export function wrapText(text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current.length + word.length + 1 > width) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}