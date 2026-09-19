import { test, expect, type Page } from "@playwright/test";
import {
  BinaryBitmap,
  HybridBinarizer,
  RGBLuminanceSource,
  QRCodeReader,
} from "@zxing/library";
async function drag(page: Page, id: string, touch: boolean, wrong = false) {
  const piece = page.locator('[data-piece="' + id + '"]');
  await piece.scrollIntoViewIfNeeded();
  const a = (await piece.boundingBox())!;
  const b = (await page.locator('[data-target="' + id + '"]').boundingBox())!;
  const sx = a.x + a.width / 2,
    sy = a.y + a.height / 2,
    ex = wrong ? 20 : b.x + b.width / 2,
    ey = wrong ? 20 : b.y + b.height / 2;
  if (touch) {
    const session = await page.context().newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: sx, y: sy }],
    });
    for (let i = 1; i <= 12; i++) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [
          { x: sx + ((ex - sx) * i) / 12, y: sy + ((ey - sy) * i) / 12 },
        ],
      });
    }
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await session.detach();
  } else {
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await page.mouse.move(ex, ey, { steps: 12 });
    await page.mouse.up();
  }
}
test("questions, every tulip, completion and scannable QR", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Our Little/ })).toBeVisible();
  await page.screenshot({
    path: "test-results/welcome-" + test.info().project.name + ".png",
    fullPage: true, animations: "disabled",
  });
  await page.getByRole("button", { name: "Let’s Start" }).click();
  await page.getByLabel("Your answer").fill("wrong");
  await page.getByRole("button", { name: /^Next/ }).click();
  await expect(page.locator("#answer-error")).toBeVisible();
  await page.getByLabel("Your answer").fill("Aug 28, 2024");
  await page.getByRole("button", { name: /^Next/ }).click();
  await expect(page.getByRole("heading")).toHaveText(
    "What was the first movie or cine we watched together?",
  );
  await page.getByLabel("Your answer").fill("HAIKYU");
  await page.getByRole("button", { name: /^Next/ }).click();
  await expect(page.getByRole("heading")).toHaveText(
    "What flowers did you say to me after our first make out?",
  );
  await page.getByLabel("Your answer").fill("TULIPS");
  await page.getByRole("button", { name: "Check My Answer" }).click();
  await page.getByRole("button", { name: "Start Our Memories" }).click();
  await page.screenshot({
    path: "test-results/bouquet-" + test.info().project.name + ".png",
    fullPage: true, animations: "disabled",
  });
  for (let i = 1; i <= 7; i++) {
    await page
      .getByRole("button", { name: new RegExp("^Open memory " + i + ":") })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close popup" }).click();
  }
  await expect(
    page.getByRole("heading", { name: "You Found Them All!" }),
  ).toBeVisible();
  await expect(page.getByText("I LOVE YOU", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Reveal My Last Surprise" }).click();
  await expect(
    page.getByRole("heading", { name: "One Last Clue" }),
  ).toBeVisible();
  const pixels = await page.locator(".qr-code svg").evaluate(async (svg) => {
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.src =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 416;
    canvas.height = 416;
    const c = canvas.getContext("2d")!;
    c.fillStyle = "white";
    c.fillRect(0, 0, 416, 416);
    c.drawImage(img, 0, 0, 416, 416);
    const rgba = c.getImageData(0, 0, 416, 416).data;
    return Array.from({ length: 416 * 416 }, (_, i) => rgba[i * 4]);
  });
  const decoded = new QRCodeReader()
    .decode(
      new BinaryBitmap(
        new HybridBinarizer(
          new RGBLuminanceSource(Uint8ClampedArray.from(pixels), 416, 416),
        ),
      ),
    )
    .getText();
  expect(decoded).toBe("http://127.0.0.1:3000/lego");
  await page.getByRole("link", { name: "Open Puzzle Here" }).click();
  await expect(
    page.getByRole("heading", { name: "LEGO Love Puzzle" }),
  ).toBeVisible();
});
test("drag, reject, restore, complete and both brick messages", async ({
  page,
}, info) => {
  const touch = info.project.name === "mobile";
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/lego");
  await page.getByRole("button", { name: "Start Puzzle" }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  await drag(page, "a", touch, true);
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  await page.waitForTimeout(450);
  await drag(page, "a", touch);
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  await expect(page.locator('[data-piece="a"]')).toHaveCount(0);
  await page.reload();
  await page.getByRole("button", { name: "Start Puzzle" }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  await page.screenshot({
    path: "test-results/puzzle-" + info.project.name + ".png",
    fullPage: true, animations: "disabled",
  });
  for (const id of "bcdefghijkl") {
    await drag(page, id, touch);
  }
  await expect(
    page.getByRole("heading", { name: "Puzzle Completed!" }),
  ).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "12",
  );
  expect(
    await page.evaluate(() =>
      localStorage.getItem("lego-love-puzzle-completed"),
    ),
  ).toBe("true");
  await expect(page.getByRole("button", { name: "Continue" })).toHaveCount(0);
  await page.getByRole("button", { name: "Reveal the Message" }).click();
  await expect(
    page.getByRole("img", { name: "I love you, built from LEGO bricks" }),
  ).toBeVisible();
  await page.waitForTimeout(1800);
  await page.screenshot({
    path: "test-results/word-" + info.project.name + ".png",
    fullPage: true, animations: "disabled",
  });
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("img", { name: "I LOVE YOU", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("And I always will.")).toBeVisible();
  await page.waitForTimeout(700);
  await page.screenshot({
    path: "test-results/final-" + info.project.name + ".png",
    fullPage: true, animations: "disabled",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("all requested date formats are accepted", async ({ page }) => {
  for (const value of [
    "August 28, 2024",
    "08/28/2024",
    "2024-08-28",
    "aUg 28, 2024",
  ]) {
    await page.goto("/");
    await page.getByRole("button", { name: "Let’s Start" }).click();
    await page.getByLabel("Your answer").fill(value);
    await page.getByRole("button", { name: /^Next/ }).click();
    await expect(page.getByRole("heading")).toHaveText(
      "What was the first movie or cine we watched together?",
    );
  }
});
test("invalid storage and keyboard placement", async ({ page }) => {
  await page.goto("/lego");
  await page.evaluate(() =>
    localStorage.setItem("lego-love-puzzle-progress", '["a","a","bad",null]'),
  );
  await page.reload();
  await page.getByRole("button", { name: "Start Puzzle" }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  await page.getByRole("button", { name: "Drag piece B", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "2",
  );
});
